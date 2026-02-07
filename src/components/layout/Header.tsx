"use client";

import Link from "next/link";
import { Snowflake, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/map" className="flex items-center gap-2 font-bold text-lg">
          <Snowflake className="w-6 h-6" />
          <span className="hidden sm:inline">青森市除排雪マップ</span>
          <span className="sm:hidden">除排雪マップ</span>
        </Link>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline">
                <User className="w-4 h-4 inline mr-1" />
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded transition-colors"
            >
              <LogIn className="w-4 h-4" />
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
