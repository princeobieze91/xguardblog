"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Loader2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { PostWithAuthor } from "@/types/supabase";

interface ExternalPostCardProps {
  post: PostWithAuthor & { url?: string; blogger_post_id?: string; source?: string };
  priority?: boolean;
}

export function ExternalPostCard({ post, priority = false }: ExternalPostCardProps) {
  const isExternal = post.url && post.blogger_post_id;
  
  // If it's an external post with Blogger URL, link directly
  const linkHref = isExternal ? post.url : `/blog/${post.slug}`;
  const target = isExternal ? "_blank" : undefined;
  const rel = isExternal ? "noopener noreferrer" : undefined;
  
  return (
    <Link href={linkHref} target={target} rel={rel}>
      <div className="card overflow-hidden group h-full flex flex-col cursor-pointer">
        {post.cover_image ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isExternal && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                External
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/30 dark:to-rose-900/30 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary-400 dark:text-primary-600">No Image</span>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {post.source && (
            <span className="text-xs font-medium text-primary-500 mb-2">
              {post.source}
            </span>
          )}
          <h3 className="font-bold font-display text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-dark-900 dark:text-white truncate">
                {post.profiles?.name || "XGuard Bot"}
              </p>
              <p className="text-xs text-dark-400">
                {formatDate(post.published_at ?? post.created_at)}
              </p>
            </div>
            <span className="text-xs text-dark-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.read_time || 3}m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ExternalPostsPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setPosts(data as any);
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function triggerFetch() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/trigger-bot", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        await loadPosts();
      } else {
        console.error("Fetch error:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const externalPosts = posts.filter(p => p.url && p.blogger_post_id);
  const localPosts = posts.filter(p => !p.blogger_post_id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
            Latest News
          </h1>
          <p className="text-dark-500 mt-1">
            Auto-fetched from top tech sources • Updated automatically
          </p>
        </div>
        <button
          onClick={triggerFetch}
          disabled={refreshing}
          className="btn-primary flex items-center gap-2"
        >
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {externalPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Latest from the web</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalPosts.slice(0, 6).map((post) => (
              <ExternalPostCard key={post.id} post={post as any} />
            ))}
          </div>
        </section>
      )}

      {localPosts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">XGuard Original Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localPosts.slice(0, 6).map((post) => (
              <ExternalPostCard key={post.id} post={post as any} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-dark-500">No posts yet. The bot will fetch content soon!</p>
        </div>
      )}
    </div>
  );
}