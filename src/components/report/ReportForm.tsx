"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { REPORT_STATUSES, MAX_COMMENT_LENGTH } from "@/lib/constants";
import type { ReportStatus } from "@/lib/constants";
import LocationPicker from "./LocationPicker";
import PhotoUpload from "./PhotoUpload";
import { Send, Loader2 } from "lucide-react";

export default function ReportForm() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<ReportStatus | "">("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !status) return;

    setSubmitting(true);
    setError(null);

    try {
      let photo_url: string | undefined;

      // 写真アップロード
      if (photo) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("ログインが必要です");
          setSubmitting(false);
          return;
        }
        const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("report-photos")
          .upload(filePath, photo, { contentType: "image/jpeg" });

        if (uploadError) {
          setError("写真のアップロードに失敗しました");
          setSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("report-photos")
          .getPublicUrl(filePath);

        photo_url = urlData.publicUrl;
      }

      // レポート投稿
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.lat,
          lng: position.lng,
          status,
          comment: comment || undefined,
          photo_url,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "投稿に失敗しました");
        setSubmitting(false);
        return;
      }

      router.push("/map");
    } catch {
      setError("投稿中にエラーが発生しました");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* 場所選択 */}
      <LocationPicker
        position={position}
        onPositionChange={(lat, lng) => setPosition({ lat, lng })}
      />

      {/* ステータス選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          除排雪ステータス
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(REPORT_STATUSES) as [ReportStatus, typeof REPORT_STATUSES[ReportStatus]][]).map(
            ([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                  status === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: value.color }}
                />
                <div>
                  <span className="text-sm font-medium">{value.label}</span>
                  <p className="text-xs text-gray-500">{value.description}</p>
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {/* コメント */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          コメント（任意）
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="道路の状況を簡単に説明してください"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>
      </div>

      {/* 写真 */}
      <PhotoUpload onPhotoReady={setPhoto} />

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={!position || !status || submitting}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            投稿中...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            投稿する
          </>
        )}
      </button>
    </form>
  );
}
