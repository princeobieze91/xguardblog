import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PenSquare, FileText, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: posts }, { data: profile }] = await Promise.all([
    supabase
      .from("posts")
      .select("id,title,status,view_count,created_at,published_at")
      .eq("author_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
  ]);

  const isAdmin = profile?.role === "admin";

  const totalViews = posts?.reduce((a, p) => a + (p.view_count ?? 0), 0) ?? 0;
  const published = posts?.filter((p) => p.status === "published").length ?? 0;
  const drafts = posts?.filter((p) => p.status === "draft").length ?? 0;

  const stats = [
    {
      icon: FileText,
      label: "Published",
      value: published,
      color: "text-primary-500",
    },
    { icon: FileText, label: "Drafts", value: drafts, color: "text-dark-400" },
    {
      icon: Eye,
      label: "Total Views",
      value: totalViews,
      color: "text-green-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="section-title">
            Welcome back, {profile?.name?.split(" ")[0]} 👋
          </h1>
          <p className="section-subtitle text-sm">
            Here&apos;s what&apos;s happening with your blog.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/posts/new"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <PenSquare className="w-4 h-4" /> Write New Post
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <Icon className={`w-6 h-6 mb-2 ${color}`} />
            <p className="text-2xl font-bold font-display text-dark-900 dark:text-white">
              {value}
            </p>
            <p className="text-sm text-dark-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="card p-6">
        <h2 className="text-lg font-bold font-display text-dark-900 dark:text-white mb-4">
          Recent Posts
        </h2>
        {posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-2 border-b border-dark-100 dark:border-dark-700 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/posts/${post.id}/edit`}
                    className="text-sm font-medium text-dark-900 dark:text-white hover:text-primary-500 transition-colors truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-dark-400">
                    {formatDate(post.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`badge text-xs ${post.status === "published" ? "badge-green" : "badge-gray"}`}
                  >
                    {post.status}
                  </span>
                  <span className="text-xs text-dark-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.view_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-400 text-sm text-center py-6">
            No posts yet.{" "}
            <Link
              href="/dashboard/posts/new"
              className="text-primary-500 hover:underline"
            >
              Write your first post!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
