import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { lat, lng, status, comment, photo_url } = body;

  if (!lat || !lng || !status) {
    return NextResponse.json(
      { error: "位置情報とステータスは必須です" },
      { status: 400 }
    );
  }

  const validStatuses = ["cleared", "not_cleared", "in_progress", "impassable"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "無効なステータスです" },
      { status: 400 }
    );
  }

  if (comment && comment.length > 200) {
    return NextResponse.json(
      { error: "コメントは200文字以内です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      location: `POINT(${lng} ${lat})`,
      status,
      comment: comment || null,
      photo_url: photo_url || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Report insert error:", error);
    return NextResponse.json(
      { error: "投稿に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
