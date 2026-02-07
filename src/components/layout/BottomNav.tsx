"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Calendar, PenSquare } from "lucide-react";

const navItems = [
  { href: "/map", label: "現況マップ", icon: Map },
  { href: "/schedule", label: "予定・リンク", icon: Calendar },
  { href: "/report", label: "投稿する", icon: PenSquare },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-5xl mx-auto flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                isActive
                  ? "text-blue-700 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-700" : ""}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
