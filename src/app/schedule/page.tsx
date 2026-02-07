import { Calendar } from "lucide-react";
import ExternalLinks from "@/components/layout/ExternalLinks";

export default function SchedulePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-700" />
        <h1 className="text-xl font-bold">除排雪予定・関連リンク</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        青森市の公式除排雪情報や関連サイトへのリンク集です。
        最新の作業予定は公式サイトでご確認ください。
      </p>
      <ExternalLinks />
    </div>
  );
}
