"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PostWithAuthor } from "@/types/supabase";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Search Articles</h1>
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or content..."
          className="input w-full"
        />
        <button className="btn-primary" onClick={doSearch} disabled={loading}>
          Search
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card p-4 flex flex-col"> 
            {p.cover_image && (
              <div className="h-40 relative mb-2 rounded-card overflow-hidden">
                <Image src={p.cover_image} alt={p.title} fill className="object-cover" />
              </div>
            )}
            <div className="font-semibold line-clamp-2 mb-1">{p.title}</div>
            <div className="text-sm text-dark-600 line-clamp-2">{p.excerpt}</div>
          </Link>
        ))}
      </div>
      {results.length === 0 && !loading && (
        <p className="text-dark-500 mt-6">No results yet. Try a different query.</p>
      )}
    </div>
  );
}
