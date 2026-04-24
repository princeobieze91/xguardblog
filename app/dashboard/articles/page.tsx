"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, ExternalLink, Image as ImageIcon, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Article } from "@/types/supabase";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const supabase = createClient();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchArticles();

    const channel = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          fetchArticles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchArticles, supabase]);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from("articles")
      .update({ status: newStatus } as { status: string })
      .eq("id", id);

    if (!error) {
      setArticles(articles.map((a: Article) => 
        a.id === id ? { ...a, status: newStatus } : a
      ));
    }
    setUpdating(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingCount = articles.filter(a => a.status === "pending_review").length;
  const publishedCount = articles.filter(a => a.status === "published").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Fetched Articles
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mt-1">
            Review and approve articles from external sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchArticles()}
            disabled={loading}
            className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
            {pendingCount} Pending
          </span>
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
            {publishedCount} Published
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-dark-500 dark:text-dark-400">
          No articles found. Run the fetch script to get articles.
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-lg p-4 flex gap-4"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-dark-100 dark:bg-dark-800 rounded-lg overflow-hidden">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-1">
                      {article.source}
                    </span>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ml-2 ${
                      article.status === "published"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}>
                      {article.status === "published" ? "Published" : "Pending Review"}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-dark-900 dark:text-white mt-1 line-clamp-2">
                  {article.title}
                </h3>
                
                {article.summary && (
                  <p className="text-sm text-dark-500 dark:text-dark-400 mt-1 line-clamp-2">
                    {article.summary}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-dark-400 dark:text-dark-500">
                    {formatDate(article.published_at)}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-500 hover:underline flex items-center gap-1"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {article.status === "pending_review" ? (
                  <>
                    <button
                      onClick={() => updateStatus(article.id, "published")}
                      disabled={updating === article.id}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      {updating === article.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => updateStatus(article.id, "rejected")}
                      disabled={updating === article.id}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => updateStatus(article.id, "pending_review")}
                    disabled={updating === article.id}
                    className="p-2 bg-dark-200 dark:bg-dark-700 hover:bg-dark-300 dark:hover:bg-dark-600 text-dark-600 dark:text-dark-300 rounded-lg transition-colors disabled:opacity-50"
                    title="Revert to pending"
                  >
                    {updating === article.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
