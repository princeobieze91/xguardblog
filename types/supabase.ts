export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          role: "reader" | "author" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "reader" | "author" | "admin";
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "reader" | "author" | "admin";
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image: string | null;
          status: "draft" | "published";
          author_id: string;
          category_id: string | null;
          view_count: number;
          read_time: number;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          // Auto-bot fields
          url: string | null;
          blogger_post_id: string | null;
          source: string | null;
        };
        Insert: {
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published";
          author_id: string;
          category_id?: string | null;
          read_time?: number;
          published_at?: string | null;
          url?: string | null;
          blogger_post_id?: string | null;
          source?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published";
          author_id?: string;
          category_id?: string | null;
          view_count?: number;
          read_time?: number;
          published_at?: string | null;
          url?: string | null;
          blogger_post_id?: string | null;
          source?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          color?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id: string | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string | null;
        };
        Update: {
          content?: string;
          author_id?: string;
          post_id?: string;
          parent_id?: string | null;
          is_pinned?: boolean;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: number;
          title: string;
          url: string;
          summary: string | null;
          image_url: string | null;
          source: string;
          published_at: string;
          status: string;
          created_at: string;
        };
        Insert: {
          title: string;
          url: string;
          summary?: string | null;
          image_url?: string | null;
          source: string;
          published_at: string;
          status?: string;
        };
        Update: {
          title?: string;
          url?: string;
          summary?: string | null;
          image_url?: string | null;
          source?: string;
          published_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
        };
        Update: {
          id?: string;
          email?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];

export type PostWithAuthor = Post & {
  profiles: Pick<Profile, "id" | "name" | "username" | "avatar_url">;
  categories: Pick<Category, "id" | "name" | "slug" | "color"> | null;
};

export type CommentWithAuthor = Comment & {
  profiles: Pick<Profile, "id" | "name" | "username" | "avatar_url">;
  replies?: CommentWithAuthor[];
};
