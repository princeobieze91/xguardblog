import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

import { ArrowRight, Clock, Eye } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { PostWithAuthor } from "@/types/supabase";
import Subscribe from "@/components/blog/Subscribe";

export const revalidate = 60;

async function getLatestPosts(): Promise<PostWithAuthor[]> {
  const supabase = createClient();
  
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(*), categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(9);
  
  return (data as PostWithAuthor[]) ?? [];
}

export default async function BlogPage() {
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
    <div>
      {/* Header */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-primary-50 dark:from-dark-950 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white leading-tight mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400">
            Explore our latest thoughts on development, design, and technology.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="section-title mb-8">Featured</h2>
          <Link href={`/blog/${featured.slug}`}>
            <div className="card overflow-hidden md:flex group cursor-pointer">
              {featured.cover_image && (
                <div className="relative md:w-1/2 h-64 md:h-auto">
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                {featured.categories && (
                  <Badge
                    variant="custom"
                    color={featured.categories.color}
                    className="mb-3 w-fit"
                  >
                    {featured.categories.name}
                  </Badge>
                )}
                <h3 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-dark-500 dark:text-dark-400 mb-4 text-sm leading-relaxed">
                  {truncate(featured.excerpt ?? "", 160)}
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
                    <p className="text-dark-400">
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-primary-500 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="text-center py-20 text-dark-400">
          <p className="text-lg">No articles yet. Check back soon!</p>
          <Link href="/blog" className="btn-primary mt-4 inline-flex">
            Browse Articles
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

      <section className="max-w-3xl mx-auto px-4 py-16">
        <Subscribe />
      </section>
    </div>
  );
}

function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Link href={`/blog/${post.slug}`}>
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
  );
}