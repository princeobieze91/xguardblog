import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Subscribe from "@/components/blog/Subscribe";
import SubscribePopup from "@/components/layout/SubscribePopup";
import type { PostWithAuthor } from "@/types/supabase";

export const revalidate = 60;

async function getLatestPosts() {
  const supabase = createClient();
  
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(10);
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
  
  const posts = await getLatestPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen">
      <SubscribePopup />
      
      {/* Blog Header */}
      <section className="py-12 md:py-16 px-4 text-center border-b border-dark-100 dark:border-dark-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-dark-900 dark:text-white mb-3">
            XGuard Blog
          </h1>
          <p className="text-dark-500 dark:text-dark-400">
            Insights on development, design, and technology.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h2 className="section-title mb-6 md:mb-8">Featured</h2>
          <Link href={`/blog/${featured.slug}`}>
            <div className="card overflow-hidden md:flex group cursor-pointer">
              {featured.cover_image ? (
                <div className="relative md:w-1/2 h-56 md:h-72 lg:h-80">
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              ) : (
                <div className="relative md:w-1/2 h-56 md:h-72 lg:h-80 bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/30 dark:to-rose-900/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-300 dark:text-primary-700">No Image</span>
                </div>
              )}
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                {featured.categories && (
                  <Badge
                    variant="custom"
                    color={featured.categories.color}
                    className="mb-3 w-fit"
                  >
                    {featured.categories.name}
                  </Badge>
                )}
                <h3 className="text-xl md:text-2xl font-bold font-display text-dark-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-dark-500 dark:text-dark-400 mb-4 text-sm md:text-base line-clamp-3">
                  {truncate(featured.excerpt ?? "", 180)}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <Avatar
                    name={featured.profiles.name}
                    src={featured.profiles.avatar_url}
                    size="sm"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-dark-900 dark:text-white">
                      {featured.profiles.name}
                    </p>
                    <p className="text-dark-400 text-xs">
                      {formatDate(featured.published_at ?? featured.created_at)}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-xs text-dark-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featured.read_time}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {featured.view_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest Posts Grid */}
      {rest.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="section-title">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-primary-500 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} />
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

      {isAdmin && (
        <div className="text-center pb-8">
          <Link href="/dashboard/posts/new" className="btn-primary inline-flex">
            Write New Post
          </Link>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-dark-100 dark:border-dark-800">
        <Subscribe />
      </section>
    </div>
  );
}

function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="card overflow-hidden group h-full flex flex-col cursor-pointer">
        {post.cover_image ? (
          <div className="relative h-44 md:h-48 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative h-44 md:h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/30 dark:to-rose-900/30 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary-400 dark:text-primary-600">No Image</span>
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
  );
}