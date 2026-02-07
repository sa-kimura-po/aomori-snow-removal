// 青森市中心座標 (青森駅付近)
export const AOMORI_CENTER = {
  lat: 40.8246,
  lng: 140.7400,
} as const;

export const DEFAULT_ZOOM = 14;

export const REPORT_STATUSES = {
  cleared: {
    label: "除雪済み",
    color: "#22c55e",
    description: "除雪が完了している道路",
  },
  not_cleared: {
    label: "未除雪",
    color: "#ef4444",
    description: "まだ除雪されていない道路",
  },
  in_progress: {
    label: "作業中",
    color: "#eab308",
    description: "現在除雪作業が行われている",
  },
  impassable: {
    label: "通行困難",
    color: "#a855f7",
    description: "積雪や障害物により通行が困難",
  },
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

// 投稿の有効期限（時間）
export const REPORT_EXPIRY_HOURS = 24;

// 写真リサイズの最大幅
export const MAX_PHOTO_WIDTH = 1200;

// コメントの最大文字数
export const MAX_COMMENT_LENGTH = 200;

// 外部リンク
export const EXTERNAL_LINKS = [
  {
    title: "青森市 除排雪出動指令状況",
    url: "https://www.city.aomori.aomori.jp/kurashi_kankyo/kitaguni/1002413/1002435.html",
    description: "青森市公式の除排雪出動指令状況マップ（毎日17時頃更新）",
  },
  {
    title: "青森市除排雪対策本部",
    url: "https://www.city.aomori.aomori.jp/kurashi_kankyo/kitaguni/1009820.html",
    description: "青森市の除排雪対応体制・警戒情報",
  },
  {
    title: "青森みち情報",
    url: "https://www.koutsu-aomori.com/Road/livecamera.html",
    description: "青森県内の道路ライブカメラ・通行規制情報",
  },
] as const;
