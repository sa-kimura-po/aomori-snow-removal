import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "青森市除排雪マップ",
  description:
    "青森市の除排雪状況を市民が投稿・共有するリアルタイムマップ。どの道路が通れるか一目で確認できます。",
  openGraph: {
    title: "青森市除排雪マップ",
    description:
      "青森市の除排雪状況を市民が投稿・共有するリアルタイムマップ",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="pb-bottom-nav">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
