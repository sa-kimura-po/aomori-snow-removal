"use client";

import { useAuth } from "@/hooks/useAuth";
import ReportForm from "@/components/report/ReportForm";
import Link from "next/link";
import { PenSquare, LogIn } from "lucide-react";

export default function ReportPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <PenSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">投稿にはログインが必要です</h2>
          <p className="text-sm text-gray-500 mb-6">
            除排雪状況を投稿するにはログインしてください。
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            ログインする
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <PenSquare className="w-6 h-6 text-blue-700" />
        <h1 className="text-xl font-bold">除排雪状況を投稿</h1>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-green-800">
          ここで投稿した除排雪状況は「現況マップ」に表示され、他の市民と共有されます。地図をタップして場所を選び、状況を投稿してください。投稿は24時間後に自動的に期限切れになります。
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
