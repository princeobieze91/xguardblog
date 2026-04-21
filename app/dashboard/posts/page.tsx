"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { PenSquare, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
interface PostItem {
  id: string;
  title: string;
  status: "draft" | "published";
  view_count: number;
  created_at: string;
  author_id: string;
}

export default function PostsPage() {
  const [posts, setPosts]   = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id,title,status,view_count,created_at,author_id")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    init();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    load();

    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, load, supabase]);

  const toggleStatus = async (post: PostItem) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("posts")
      .update({ 
        status: newStatus, 
        published_at: newStatus === "published" ? new Date().toISOString() : null 
      })
      .eq("id", post.id);
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    setToast({ message: `Post ${newStatus === "published" ? "published" : "unpublished"}.`, type: "success" });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    setToast({ message: "Post deleted.", type: "success" });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">My Posts</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            disabled={loading}
            className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/dashboard/posts/new"><Button size="sm"><PenSquare className="w-4 h-4" /> New Post</Button></Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-dark-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-dark-400">
            No posts yet. <Link href="/dashboard/posts/new" className="text-primary-500 hover:underline">Write your first!</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-dark-50 dark:bg-dark-800 border-b border-dark-100 dark:border-dark-700">
              <tr>
                {["Title", "Status", "Views", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/posts/${post.id}/edit`} className="font-medium text-dark-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${post.status === "published" ? "badge-green" : "badge-gray"}`}>{post.status}</span>
                  </td>
                  <td className="px-4 py-3 text-dark-500">{post.view_count}</td>
                  <td className="px-4 py-3 text-dark-500">{formatDate(post.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(post)} title={post.status === "published" ? "Unpublish" : "Publish"} className="p-1.5 rounded text-dark-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        {post.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link href={`/dashboard/posts/${post.id}/edit`} className="p-1.5 rounded text-dark-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <PenSquare className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 rounded text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
