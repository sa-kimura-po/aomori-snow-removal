-- =============================================
-- 青森市除排雪マップ - Supabase セットアップSQL
-- Supabase SQLエディタで実行してください
-- =============================================

-- 1. PostGIS 拡張を有効化
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. profiles テーブル
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 新規ユーザー登録時に自動的にprofileを作成するトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. reports テーブル
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('cleared', 'not_cleared', 'in_progress', 'impassable')),
  comment TEXT CHECK (char_length(comment) <= 200),
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- 空間インデックス
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- 期限切れフィルタ用インデックス
CREATE INDEX IF NOT EXISTS reports_expires_at_idx ON reports (expires_at);

-- reports RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_select_all" ON reports;
CREATE POLICY "reports_select_all" ON reports
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reports_insert_auth" ON reports;
CREATE POLICY "reports_insert_auth" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reports_delete_own" ON reports;
CREATE POLICY "reports_delete_own" ON reports
  FOR DELETE USING (auth.uid() = user_id);

-- 4. 地図範囲内の有効な投稿を取得するRPC関数
CREATE OR REPLACE FUNCTION get_reports_in_bounds(
  min_lat DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  min_lng DOUBLE PRECISION,
  max_lng DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT,
  comment TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.user_id,
    ST_Y(r.location::geometry) AS lat,
    ST_X(r.location::geometry) AS lng,
    r.status,
    r.comment,
    r.photo_url,
    r.created_at,
    r.expires_at,
    COALESCE(p.display_name, '匿名') AS display_name
  FROM reports r
  LEFT JOIN profiles p ON r.user_id = p.id
  WHERE r.expires_at > now()
    AND ST_Intersects(
      r.location,
      ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)::geography
    )
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ストレージバケット作成
-- Supabase ダッシュボード > Storage で "report-photos" バケットを作成し、
-- 以下のポリシーを設定:
--   - Public: ON (写真URLを直接参照するため)
--   - INSERT: authenticated ユーザーのみ
--   - SELECT: 全ユーザー
--   - DELETE: 自分のファイルのみ
