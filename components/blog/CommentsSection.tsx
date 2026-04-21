"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CommentWithAuthor } from "@/types/supabase";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatRelativeDate } from "@/lib/utils";
import { MessageCircle, Reply, Pin } from "lucide-react";

function getGuestId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 15);
    localStorage.setItem("guest_id", id);
  }
  return id;
}

function getGuestName() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("guest_name") || "";
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const id = getGuestId();
    setGuestId(id);
    setGuestName(getGuestName());
    const load = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*, profiles(id,name,username,avatar_url)")
        .eq("post_id", postId)
        .is("parent_id", null)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: true });

      const roots = (data as CommentWithAuthor[]) ?? [];
      for (const root of roots) {
        const { data: replies } = await supabase
          .from("comments")
          .select("*, profiles(id,name,username,avatar_url)")
          .eq("post_id", postId)
          .eq("parent_id", root.id)
          .order("created_at", { ascending: true });
        root.replies = (replies as CommentWithAuthor[]) ?? [];
      }
      setComments(roots);
    };
    load();
  }, [postId, supabase]);

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(id,name,username,avatar_url)")
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: true });

    const roots = (data as CommentWithAuthor[]) ?? [];

    for (const root of roots) {
      const { data: replies } = await supabase
        .from("comments")
        .select("*, profiles(id,name,username,avatar_url)")
        .eq("post_id", postId)
        .eq("parent_id", root.id)
        .order("created_at", { ascending: true });
      root.replies = (replies as CommentWithAuthor[]) ?? [];
    }
    setComments(roots);
  };

  const submit = async (parentId?: string) => {
    const content = parentId ? replyText : text;
    const name = parentId ? replyName : guestName;
    if (!content.trim()) return;
    
    const finalUserId = guestId || "guest_" + Math.random().toString(36).slice(2, 15);
    const finalName = name.trim() || "Anonymous";
    
    if (!guestId && typeof window !== "undefined") {
      localStorage.setItem("guest_id", finalUserId);
      localStorage.setItem("guest_name", finalName);
    }
    
    setLoading(true);
    await supabase.from("comments").insert({ 
      content: content.trim(), 
      author_id: finalUserId, 
      post_id: postId, 
      parent_id: parentId ?? null 
    });
    if (parentId) { setReplyText(""); setReplyName(""); setReplyTo(null); } else { setText(""); }
    await loadComments();
    setLoading(false);
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div>
      <h3 className="text-xl font-bold font-display text-dark-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-500" />
        {totalCount} Comment{totalCount !== 1 ? "s" : ""}
      </h3>

      {/* New comment */}
      <div className="mb-8">
        <Input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Your name (required)"
          className="mb-3"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Share your thoughts..."
          className="input resize-none mb-3"
        />
        <Button onClick={() => submit()} loading={loading} disabled={!text.trim() || !guestName.trim()}>Post Comment</Button>
      </div>

      {/* Comment list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem comment={comment} onReply={() => setReplyTo(replyTo === comment.id ? null : comment.id)} />
            {/* Reply form */}
            {replyTo === comment.id && (
              <div className="ml-12 mt-3">
                <Input 
                  value={replyName} 
                  onChange={(e) => setReplyName(e.target.value)} 
                  placeholder="Your name" 
                  className="mb-2 text-sm" 
                />
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} placeholder="Write a reply..." className="input resize-none mb-2 text-sm" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => submit(comment.id)} loading={loading} disabled={!replyText.trim()}>Reply</Button>
                  <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>Cancel</Button>
                </div>
              </div>
            )}
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 mt-4 space-y-4 border-l-2 border-primary-100 dark:border-primary-900/30 pl-4">
                {comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} isReply />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply, isReply = false }: { comment: CommentWithAuthor; onReply?: () => void; isReply?: boolean }) {
  const name = comment.profiles?.name || comment.author_id?.replace("guest_", "Guest: ") || "Anonymous";
  
  return (
    <div className="flex gap-3">
      <Avatar name={name} src={comment.profiles?.avatar_url} size="sm" />
      <div className="flex-1">
        <div className="card-flat rounded-card p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-dark-900 dark:text-white">{name}</span>
            {comment.is_pinned && <span className="badge-primary text-xs flex items-center gap-1"><Pin className="w-3 h-3" />Pinned</span>}
            <span className="text-xs text-dark-400 ml-auto">{formatRelativeDate(comment.created_at)}</span>
          </div>
          <p className="text-sm text-dark-700 dark:text-dark-300">{comment.content}</p>
        </div>
        {!isReply && onReply && (
          <button onClick={onReply} className="flex items-center gap-1 text-xs text-dark-400 hover:text-primary-500 mt-1 ml-1 transition-colors">
            <Reply className="w-3 h-3" /> Reply
          </button>
        )}
      </div>
    </div>
  );
}