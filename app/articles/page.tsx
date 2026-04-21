import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Clock, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export const revalidate = 60;

async function getArticles() {
  const supabase = createClient();
  
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);
  
  if (error) {
    console.error("Articles error:", error);
    return [];
  }
  
  return articles || [];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-b from-primary-50 dark:from-dark-950 to-white dark:to-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white mb-4">
            Trending{" "}
            <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400">
            Latest tech news and insights from top sources
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12 text-dark-500 dark:text-dark-400">
            <p className="text-lg">No articles available yet.</p>
            <p className="text-sm mt-2">Check back soon for trending tech articles!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article, idx) => (
              <Link
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block p-0 hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-dark-100 dark:bg-dark-800 relative">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-dark-300 dark:text-dark-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {article.source}
                      </span>
                      <span className="text-xs text-dark-400">
                        {new Date(article.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold font-display text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.summary && (
                      <p className="text-dark-600 dark:text-dark-400 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Read Original
                      </span>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center p-6">
                    <ArrowRight className="w-5 h-5 text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
