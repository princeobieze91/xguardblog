import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Calendar, Tag, ArrowRight } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <SubscribePopup />
      
      {/* Header */}
      <header className="bg-dark-900 dark:bg-dark-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">XGuard Blog</h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Insights on development, design, and technology
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Latest Hero Post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className="block mb-12 group">
                <article className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {posts[0].cover_image ? (
                    <div className="relative h-72 md:h-96">
                      <Image
                        src={posts[0].cover_image}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="h-72 md:h-96 bg-gradient-to-br from-primary-600 to-rose-600 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white/50">XGuard</span>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    {posts[0].categories && (
                      <Badge variant="custom" color={posts[0].categories.color} className="mb-4">
                        {posts[0].categories.name}
                      </Badge>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white mb-4 group-hover:text-primary-500 transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-dark-500 dark:text-dark-400 mb-6 line-clamp-3">
                      {truncate(posts[0].excerpt ?? "", 200)}
                    </p>
                    <div className="flex items-center justify-between border-t border-dark-100 dark:border-dark-700 pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={posts[0].profiles.name} src={posts[0].profiles.avatar_url} size="sm" />
                        <div>
                          <p className="font-medium text-dark-900 dark:text-white text-sm">{posts[0].profiles.name}</p>
                          <p className="text-dark-400 text-xs">{formatDate(posts[0].published_at ?? posts[0].created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-dark-400 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{posts[0].read_time}m</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{posts[0].view_count}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Recent Posts */}
            {posts.length > 1 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-dark-900 dark:text-white">Recent Articles</h3>
                  <Link href="/blog" className="text-primary-500 text-sm font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {posts.slice(1, 5).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                      <article className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
                        {post.cover_image ? (
                          <div className="relative md:w-48 h-48 md:h-auto shrink-0">
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="md:w-48 h-48 bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/30 dark:to-rose-900/30 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-bold text-primary-300">XGuard</span>
                          </div>
                        )}
                        <div className="p-5 flex flex-col justify-center flex-1">
                          {post.categories && (
                            <Badge variant="custom" color={post.categories.color} className="mb-2 w-fit text-xs">
                              {post.categories.name}
                            </Badge>
                          )}
                          <h4 className="text-lg font-bold text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-dark-500 dark:text-dark-400 text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-dark-400 text-xs mt-auto">
                            <Avatar name={post.profiles.name} src={post.profiles.avatar_url} size="sm" />
                            <span>{post.profiles.name}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_at ?? post.created_at)}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}m</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Grid Posts */}
            {posts.length > 5 && (
              <section>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">More Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.slice(5, 11).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                      <article className="bg-white dark:bg-dark-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                        {post.cover_image ? (
                          <div className="relative h-40">
                            <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-br from-primary-100 to-rose-100" />
                        )}
                        <div className="p-4">
                          {post.categories && (
                            <Badge variant="custom" color={post.categories.color} className="mb-2 text-xs">
                              {post.categories.name}
                            </Badge>
                          )}
                          <h4 className="font-bold text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-dark-500 dark:text-dark-400 text-sm line-clamp-2">{post.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {posts.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-xl">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">Welcome to XGuard</h2>
                <p className="text-dark-500 mb-8">Be the first to share your ideas with the world.</p>
                <Link href="/register" className="btn-primary inline-flex">Get Started</Link>
              </div>
            )}

            {isAdmin && (
              <div className="text-center mt-8">
                <Link href="/dashboard/posts/new" className="btn-primary inline-flex">Write New Post</Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            {/* About */}
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm mb-8">
              <h3 className="font-bold text-dark-900 dark:text-white mb-3">About XGuard</h3>
              <p className="text-dark-500 dark:text-dark-400 text-sm">
                A modern blog platform sharing insights on development, design, and technology. Written by developers, for developers.
              </p>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm mb-8">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/blog" className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm hover:bg-primary-200 transition-colors">
                  All
                </Link>
              </div>
            </div>

            {/* Subscribe */}
            <div className="bg-gradient-to-br from-primary-600 to-rose-600 rounded-xl p-6 text-white mb-8">
              <h3 className="font-bold mb-2">Stay Updated</h3>
              <p className="text-white/80 text-sm mb-4">Get the latest articles delivered to your inbox.</p>
              <Subscribe />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}