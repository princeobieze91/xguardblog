import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate, sanitizeHtml } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import CommentsSection from "@/components/blog/CommentsSection";
import LikeButton from "@/components/blog/LikeButton";
import ShareButton from "@/components/ui/ShareButton";
import { Clock, Eye, Calendar } from "lucide-react";
import type { PostWithAuthor } from "@/types/supabase";
import Link from "next/link";

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string): Promise<any> {
  const supabase = createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !post) return null;
  
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", post.author_id).single();
  const { data: category } = post.category_id 
    ? await supabase.from("categories").select("*").eq("id", post.category_id).single()
    : { data: null };
  
  return { 
    ...post, 
    profiles: profile || { id: "", name: "Unknown", username: "", avatar_url: null },
    categories: category 
  };
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: `${post.categories?.name}, blog, articles, ${post.title.split(' ').slice(0, 5).join(', ')}`,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "",
      images: post.cover_image ? [post.cover_image] : [],
      siteName: "XGuard",
      locale: "en_US",
      type: "article",
      publishedTime: post.published_at ?? post.created_at,
      authors: [post.profiles.name],
      tags: [post.categories?.name].filter(Boolean),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
      creator: "@xguardblog",
    },
    other: {
      "article:published_time": post.published_at ?? post.created_at,
      "article:author": post.profiles.name,
      "article:section": post.categories?.name ?? "General",
    },
    // Structured data for rich snippets
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.cover_image ? [{ "@id": `${process.env.NEXT_PUBLIC_SITE_URL}${post.cover_image}` }] : [],
      author: {
        "@type": "Person",
        name: post.profiles.name
      },
      publisher: {
        "@type": "Organization",
        name: "XGuard",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
        }
      },
      datePublished: post.published_at ?? post.created_at,
       dateModified: post.updated_at,
       mainEntityOfPage: {
         "@type": "WebPage",
         "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
       }
     }
   };
 }

export default async function PostPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-500 mb-8 transition-colors"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        {post.categories && (
          <Badge
            variant="custom"
            color={post.categories.color}
            className="mb-4"
          >
            {post.categories.name}
          </Badge>
        )}
        <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar
              name={post.profiles.name}
              src={post.profiles.avatar_url}
              size="md"
            />
            <div>
              <p className="font-semibold text-dark-900 dark:text-white text-sm">
                {post.profiles.name}
              </p>
              <p className="text-xs text-dark-400">@{post.profiles.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-dark-400 ml-auto flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.read_time} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.view_count} views
            </span>
          </div>
        </div>
      </header>

      {post.cover_image ? (
        <div className="relative w-full h-72 md:h-96 rounded-card overflow-hidden mb-10">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="relative w-full h-72 md:h-96 rounded-card overflow-hidden mb-10 flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200">
          <span className="text-sm text-slate-600">No image available</span>
        </div>
      )}

      <div
        className="prose-xguard"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
      />

       <div className="mt-10 pt-6 border-t border-dark-100 dark:border-dark-700">
         <LikeButton postId={post.id} />
       </div>
       
       <div className="mt-8">
         <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">
           Share this article
         </h3>
         <ShareButton title={post.title} url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`} />
       </div>

      <div className="mt-10">
        <CommentsSection postId={post.id} />
      </div>
    </article>
  );
}
