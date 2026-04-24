"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  url: string;
  summary: string | null;
  image_url: string | null;
  source: string;
  published_at: string;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const sources = ["All", "TechCrunch", "Wired", "The Verge", "MIT Technology Review", "Ars Technica", "NewsAPI"];

export default function ArticlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSource = searchParams.get("source") || "All";

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from("articles")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (currentSource !== "All") {
      query = query.eq("source", currentSource);
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    
    const { data, count, error } = await query.range(from, to);

    if (!error && data) {
      setArticles(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [currentPage, currentSource]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleSourceChange = (source: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("source", source);
    params.set("page", "1");
    router.push(`/articles?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/articles?${params.toString()}`);
  };

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

      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentSource === source
                  ? "bg-primary-500 text-white"
                  : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
          Showing {articles.length} of {totalCount} articles
        </p>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-dark-500 dark:text-dark-400">
            <p className="text-lg">No articles found.</p>
            <p className="text-sm mt-2">Try selecting a different source.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
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
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/30 dark:to-rose-900/30">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary-500 text-white"
                      : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}