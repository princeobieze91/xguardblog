-- ============================================================
-- XGuard Blog Platform — Supabase Schema
-- Run this in your Supabase project > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null unique,
  name        text not null,
  username    text not null unique,
  avatar_url  text,
  bio         text,
  role        text not null default 'author' check (role in ('reader','author','admin')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Anyone can create profiles"
  on public.profiles for insert with check (true);

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
create table public.categories (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null unique,
  slug        text not null unique,
  description text,
  color       text not null default '#6C63FF',
  created_at  timestamptz default now()
);

alter table public.categories enable row level security;
create policy "Categories viewable by all" on public.categories for select using (true);
create policy "Admins manage categories"   on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Seed default categories
insert into public.categories (name, slug, color) values
  ('Technology', 'technology', '#6C63FF'),
  ('Design',     'design',     '#FF6584'),
  ('Tutorial',   'tutorial',   '#10b981'),
  ('Opinion',    'opinion',    '#f59e0b'),
  ('Career',     'career',     '#3b82f6');

-- ─────────────────────────────────────────
-- TAGS
-- ─────────────────────────────────────────
create table public.tags (
  id         uuid default uuid_generate_v4() primary key,
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz default now()
);

alter table public.tags enable row level security;
create policy "Tags viewable by all" on public.tags for select using (true);

-- ─────────────────────────────────────────
-- POSTS
-- ─────────────────────────────────────────
create table public.posts (
  id           uuid default uuid_generate_v4() primary key,
  title        text not null,
  slug         text not null unique,
  content      text not null default '',
  excerpt      text,
  cover_image  text,
  status       text not null default 'draft' check (status in ('draft','published')),
  author_id    uuid references public.profiles(id) on delete cascade not null,
  category_id  uuid references public.categories(id) on delete set null,
  view_count   int not null default 0,
  read_time    int not null default 1,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Published posts viewable by all"
  on public.posts for select using (status = 'published' or auth.uid() = author_id);

create policy "Authors create their own posts"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "Authors update their own posts"
  on public.posts for update using (auth.uid() = author_id);

create policy "Authors delete their own posts"
  on public.posts for delete using (auth.uid() = author_id);

-- ─────────────────────────────────────────
-- POST TAGS (junction)
-- ─────────────────────────────────────────
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id  uuid references public.tags(id)  on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.post_tags enable row level security;
create policy "Post tags viewable by all" on public.post_tags for select using (true);

-- ─────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────
create table public.comments (
  id         uuid default uuid_generate_v4() primary key,
  content    text not null,
  author_id  uuid references public.profiles(id) on delete cascade not null,
  post_id    uuid references public.posts(id)    on delete cascade not null,
  parent_id  uuid references public.comments(id) on delete cascade,
  is_pinned  boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Comments viewable by all"
  on public.comments for select using (true);

create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "Authors delete their comments"
  on public.comments for delete using (auth.uid() = author_id);

-- ─────────────────────────────────────────
-- LIKES
-- ─────────────────────────────────────────
create table public.likes (
  user_id    uuid references public.profiles(id) on delete cascade,
  post_id    uuid references public.posts(id)    on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;

create policy "Likes viewable by all"
  on public.likes for select using (true);

create policy "Users manage own likes"
  on public.likes for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_posts_updated_at    before update on public.posts    for each row execute function update_updated_at();
create trigger set_comments_updated_at before update on public.comments for each row execute function update_updated_at();
create trigger set_profiles_updated_at before update on public.profiles for each row execute function update_updated_at();
