import { createClient } from "@/lib/supabase/server";
import type { PostWithAuthor } from "@/types/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const supabase = createClient();

  if (!q) {
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(id,name,username,avatar_url)")
    .eq("status", "published")
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order("published_at", { ascending: false });

  // Type safety: cast to PostWithAuthor[] if needed
  const results = (posts as any) ?? [];
  return new Response(JSON.stringify({ data: results as PostWithAuthor[] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
