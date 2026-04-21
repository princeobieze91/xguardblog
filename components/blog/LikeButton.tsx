"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function getGuestId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 15);
    localStorage.setItem("guest_id", id);
  }
  return id;
}

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked]   = useState(false);
  const [count, setCount]   = useState(0);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const id = getGuestId();
    setGuestId(id);
    
    supabase.from("likes").select("user_id", { count: "exact" }).eq("post_id", postId).then(({ count: c }) => setCount(c ?? 0));
    
    if (id) {
      const { data } = supabase.from("likes").select("user_id").eq("post_id", postId).eq("user_id", id).maybeSingle();
      data?.then(d => setLiked(!!d));
    }
  }, [postId]);

  const toggle = async () => {
    if (!guestId || loading) return;
    setLoading(true);
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", guestId);
      setCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: guestId });
      setCount((c) => c + 1);
    }
    setLiked(!liked);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-pill border transition-all duration-200 text-sm font-medium",
        liked
          ? "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-500"
          : "border-dark-200 dark:border-dark-700 text-dark-500 hover:border-rose-300 hover:text-rose-500"
      )}
    >
      <Heart className={cn("w-4 h-4 transition-transform", liked && "fill-rose-500 scale-110")} />
      <span>{count}</span>
    </button>
  );
}