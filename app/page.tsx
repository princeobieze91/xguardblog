import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { PostWithAuthor } from "@/types/supabase";

export const revalidate = 60;

async function getRecentPosts() {
  const supabase = createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);
  if (error) console.error("Posts error:", error);
  if (!posts) return [];
  
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: categories } = await supabase.from("categories").select("*");
  
  return posts.map((post: any) => ({
    ...post,
    profiles: profiles?.find((p: any) => p.id === post.author_id) || { name: "Unknown" },
    categories: categories?.find((c: any) => c.id === post.category_id) || null,
  }));
}

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }
  
  const posts = await getRecentPosts();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-primary-50 dark:from-dark-950 to-white dark:to-dark-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-10 h-10 text-primary-500" />
            <span className="text-3xl font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              XGuard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white leading-tight mb-6">
            Ideas worth{" "}
            <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              sharing
            </span>
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400 mb-8 max-w-xl mx-auto">
            Discover insightful articles on development, design, and technology
            — written by people who care.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/blog"
              className="btn-primary inline-flex items-center gap-2"
            >
              Browse Articles <ArrowRight className="w-4 h-4" />
            </Link>
            {isAdmin && (
              <Link href="/dashboard/posts/new" className="btn-secondary">
                Write Post
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Recent Articles</h2>
            <Link
              href="/blog"
              className="text-primary-500 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card overflow-hidden group h-full flex flex-col cursor-pointer">
                  {post.cover_image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {post.categories && (
                      <Badge
                        variant="custom"
                        color={post.categories.color}
                        className="mb-2 w-fit text-xs"
                      >
                        {post.categories.name}
                      </Badge>
                    )}
                    <h3 className="font-bold font-display text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
                      <Avatar
                        name={post.profiles.name}
                        src={post.profiles.avatar_url}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-dark-900 dark:text-white truncate">
                          {post.profiles.name}
                        </p>
                        <p className="text-xs text-dark-400">
                          {formatDate(post.published_at ?? post.created_at)}
                        </p>
                      </div>
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.read_time}m
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-4">
            Welcome to XGuard
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mb-8 max-w-md mx-auto">
            Be the first to share your ideas with the world. Create an account
            and start writing today.
          </p>
          <Link href="/register" className="btn-primary inline-flex">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
