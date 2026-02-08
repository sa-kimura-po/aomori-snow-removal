import { Calendar, ExternalLink } from "lucide-react";
import ExternalLinks from "@/components/layout/ExternalLinks";

export default function SchedulePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-700" />
        <h1 className="text-xl font-bold">除排雪予定・関連リンク</h1>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          青森市が提供している除排雪の公式情報へのリンク集です。作業予定や道路状況は各公式サイトでご確認ください。
        </p>
      </div>

      <a
        href="https://x.com/search?q=%E9%9D%92%E6%A3%AE%E5%B8%82%20%E9%99%A4%E9%9B%AA&src=typed_query&f=live"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-black text-white rounded-lg p-4 mb-6 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <div>
              <h3 className="font-bold text-base">Xで除雪情報を見る</h3>
              <p className="text-sm text-gray-300">「青森市 除雪」のリアルタイム投稿を表示</p>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </a>

      <ExternalLinks />
    </div>
  );
}
