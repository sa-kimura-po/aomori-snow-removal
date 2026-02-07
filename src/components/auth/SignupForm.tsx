"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GoogleButton from "./GoogleButton";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName || email.split("@")[0],
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // プロフィールをアプリ側で作成
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: displayName || email.split("@")[0],
      });
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-semibold">確認メールを送信しました</p>
          <p className="text-sm mt-1">
            メール内のリンクをクリックして登録を完了してください。
          </p>
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="text-sm text-blue-700 hover:underline"
        >
          ログインページに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#f8fafc] text-gray-500">または</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            表示名
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="青森太郎（省略可）"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="6文字以上"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "登録中..." : "メールで新規登録"}
        </button>
      </form>
    </div>
  );
}
