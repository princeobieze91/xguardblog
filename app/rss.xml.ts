import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  // Build a simple RSS 2.0 feed
  const items = (posts || []).map((p: any) => {
    const link = `https://xguardblog.vercel.app/blog/${p.slug}`;
    return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${link}</link>
    <description>${escapeXml(p.excerpt ?? "")}</description>
    <pubDate>${new Date(p.published_at ?? p.created_at).toUTCString()}</pubDate>
  </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>XGuard Blog</title>
    <link>https://xguardblog.vercel.app</link>
    <description>A modern blog platform for ideas that matter.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
