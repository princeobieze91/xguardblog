"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { estimateReadTime, truncate } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Save, Send, ArrowLeft } from "lucide-react";
import Toast from "@/components/ui/Toast";
import Link from "next/link";
import type { Category } from "@/types/supabase";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
});

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: post } = await (supabase as any)
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: cats } = await (supabase as any)
        .from("categories")
        .select("*")
        .order("name");
      if (!post) {
        router.push("/dashboard/posts");
        return;
      }
      setTitle(post.title);
      setExcerpt(post.excerpt ?? "");
      setContent(post.content);
      setCover(post.cover_image ?? "");
      setCategoryId(post.category_id ?? "");
      setStatus(post.status as "draft" | "published");
      if (cats) setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (newStatus: "draft" | "published") => {
    if (!title.trim()) {
      setToast({ message: "Title is required.", type: "error" });
      return;
    }
    if (!content || content === "<p></p>") {
      setToast({ message: "Content cannot be empty.", type: "error" });
      return;
    }
    if (newStatus === "draft") {
      setSaving(true);
    } else {
      setPublishing(true);
    }

    const read_time = estimateReadTime(content);
    const auto_excerpt =
      excerpt.trim() || truncate(content.replace(/<[^>]*>/g, " "), 160);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("posts")
      .update({
        title: title.trim(),
        content,
        excerpt: auto_excerpt,
        cover_image: cover.trim() || null,
        category_id: categoryId || null,
        status: newStatus,
        read_time,
        ...(newStatus === "published" && status !== "published"
          ? { published_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", id);
    if (newStatus === "draft") {
      setSaving(false);
    } else {
      setPublishing(false);
    }
    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }
    setStatus(newStatus);
    setToast({
      message: newStatus === "published" ? "Post published!" : "Draft saved!",
      type: "success",
    });
    setTimeout(() => router.push("/dashboard/posts"), 1200);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <p className="text-dark-400">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/posts"
            className="p-2 rounded-card text-dark-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="section-title">Edit Post</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            loading={saving}
            onClick={() => save("draft")}
          >
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={publishing}
            onClick={() => save("published")}
          >
            <Send className="w-4 h-4" />{" "}
            {status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          id="title"
          label="Post Title"
          placeholder="Write a compelling title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold"
        />
        <Input
          id="excerpt"
          label="Excerpt (optional)"
          placeholder="A short description of your post..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
        <Input
          id="cover"
          label="Cover Image URL (optional)"
          placeholder="https://images.unsplash.com/..."
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        <div>
          <label className="label">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Content</label>
          <RichEditor content={content} onChange={setContent} />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
