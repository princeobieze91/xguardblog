"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, estimateReadTime, truncate } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Save, Send } from "lucide-react";
import Toast from "@/components/ui/Toast";
import type { Category } from "@/types/supabase";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
});

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile?.role !== "admin") {
        router.push("/dashboard");
      }
    };
    
    checkAdmin();
    
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (status: "draft" | "published") => {
    if (!title.trim()) {
      setToast({ message: "Title is required.", type: "error" });
      return;
    }
    if (!content || content === "<p></p>") {
      setToast({ message: "Content cannot be empty.", type: "error" });
      return;
    }

    if (status === "draft") {
      setSaving(true);
    } else {
      setPublishing(true);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const slug = generateSlug(title);
    const read_time = estimateReadTime(content);
    const auto_excerpt =
      excerpt.trim() || truncate(content.replace(/<[^>]*>/g, " "), 160);

    const { error } = await supabase.from("posts").insert({
      title: title.trim(),
      slug,
      content,
      excerpt: auto_excerpt,
      cover_image: cover.trim() || null,
      category_id: categoryId || null,
      status,
      author_id: user.id,
      read_time,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (status === "draft") {
      setSaving(false);
    } else {
      setPublishing(false);
    }
    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }
    setToast({
      message: status === "published" ? "Post published!" : "Draft saved!",
      type: "success",
    });
    setTimeout(() => router.push("/dashboard/posts"), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">New Post</h1>
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
            <Send className="w-4 h-4" /> Publish
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
