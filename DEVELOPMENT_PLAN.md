# XGuard & XItem Development Plan

## Overview

Two interconnected platforms under the **XBrand** umbrella:

- **XGuard** - Blog Content Platform (in progress)
- **XItem** - E-commerce Store (planned)

---

## Shared Design System

### Brand Identity

| Element | Value |
|---------|-------|
| Primary | `#6C63FF` (Indigo) |
| Secondary | `#FF6584` (Rose) |
| Dark Mode BG | `#0F0F1A` |
| Logo | Shield Icon + "X" Typography |
| Font Primary | Inter |
| Font Display | Poppins |

### Design Tokens (Tailwind)

```
Colors:
- primary-50 through primary-950
- rose-400, rose-500, rose-600
- dark-50 through dark-950

Border Radius:
- card: 12px
- input: 8px
- pill: 999px (full rounded)
```

### Shared Components

| Component | Location | Status |
|-----------|----------|--------|
| Button | components/ui/Button.tsx | Done |
| Input | components/ui/Input.tsx | Done |
| Badge | components/ui/Badge.tsx | Done |
| Avatar | components/ui/Avatar.tsx | Done |
| Toast | components/ui/Toast.tsx | Done |
| Card | (in globals.css) | Done |
| Modal | TBD | Phase 2 |

---

## Project 1: XGuard (Blog Platform)

### Current Status

- [x] Next.js 14 setup with App Router
- [x] Supabase auth (login/register)
- [x] Database schema (profiles, posts, comments, likes, categories, tags)
- [x] Dashboard with posts CRUD
- [x] TipTap rich text editor
- [ ] Public blog listing
- [ ] Post detail page
- [ ] Comments system
- [ ] Like button

### Features List

```
Authentication
├── Email/password login
├── User registration
├── Profile management
├── Role-based access (reader/author/admin)

Content Management
├── Create/edit/delete posts
├── Rich text editor (TipTap)
├── Draft/published status
├── Categories & tags
├── Cover images
├── SEO metadata

Social Features
├── Comments (threaded)
├── Like/unlike posts
├── Share buttons
├── View counts
```

### Technical Architecture

```
app/
├── (auth)/           # Login, register
│   ├── login/
│   └── register/
├── (blog)/           # Public blog
│   ├── page.tsx      # Blog listing
│   └── [slug]/       # Post detail
├── dashboard/        # Admin area
│   ├── page.tsx      # Dashboard home
│   ├── posts/        # Posts CRUD
│   │   ├── page.tsx  # List
│   │   ├── new/     # Create
│   │   └── [id]/   # Edit
│   └── profile/     # Profile settings

lib/
├── supabase/
│   ├── client.ts    # Client-side
│   ├── server.ts    # Server-side
│   └── middleware.ts
└── utils.ts          # Helpers
```

### Database Schema (Supabase)

Already created in `supabase/schema.sql`:

- `profiles` - User profiles
- `categories` - Post categories
- `tags` - Post tags
- `posts` - Blog posts
- `post_tags` - Many-to-many
- `comments` - Threaded comments
- `likes` - Post likes

### Development Phases

#### Phase 1: Core (Current)

- [ ] Refine auth flows
- [ ] Complete posts CRUD
- [ ] Public blog listing
- [ ] Post detail page

#### Phase 2: Social

- [ ] Comments section
- [ ] Like button
- [ ] Share functionality
- [ ] User profiles page

#### Phase 3: Polish

- [ ] SEO optimization
- [ ] OpenGraph images
- [ ] Sitemap
- [ ] RSS feed
- [ ] Search

---

## Project 2: XItem (E-commerce Store)

### Core Features

```
Product Management
├── Product listings
├── Product details (images, description, variants)
├── Categories & collections
├── Inventory management
├── Pricing & discounts

Shopping Experience
├── Product catalog
├── Product search & filters
├── Product detail page
├── Related products
├── Wishlist

Cart & Checkout
├── Shopping cart (persistent)
├── Guest cart
├── Cart totals & taxes
├── Checkout flow (multi-step)
├── Order confirmation

Payment Processing
├── Stripe integration
├── Multiple payment methods
├── Order payment status
├── Refund handling

Order Management
├── Customer orders
├── Order history
├── Order status tracking
├── Admin order management
```

### Technical Architecture

```
app/
├── (shop)/           # Public store
│   ├── page.tsx     # Home/featured
│   ├── products/    # Product listing
│   │   └── [slug]/
│   ├── cart/
│   ├── checkout/
│   └── wishlist/
├── (account)/       # User account
│   ├── orders/
│   └── settings/
└── admin/          # Admin area
    ├── products/
    ├── orders/
    └── analytics/
```

### Database Schema (Supabase)

```sql
-- Products
create table public.products (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  price       decimal not null,
  compare_at  decimal,
  images      text[],
  inventory  int default 0,
  category_id uuid references categories,
  status     text default 'active',
  created_at timestamptz default now()
);

-- Product Variants
create table public.product_variants (
  id         uuid primary key,
  product_id uuid references products,
  name       text,
  sku        text unique,
  price      decimal,
  inventory  int default 0);

-- Categories
create table public.categories (
  id          uuid primary key,
  name        text not null,
  slug        text not null unique,
  parent_id   uuid references categories);

-- Cart Items
create table public.cart_items (
  id         uuid primary key,
  user_id    uuid references profiles,
  session_id text,
  product_id uuid references products,
  quantity   int default 1,
  created_at timestamptz default now());

-- Orders
create table public.orders (
  id           uuid primary key,
  user_id      uuid references profiles,
  status      text default 'pending',
  subtotal    decimal,
  tax         decimal,
  total       decimal,
  shipping    text,
  address     jsonb,
  created_at  timestamptz default now());

-- Order Items
create table public.order_items (
  id        uuid primary key,
  order_id  uuid references orders,
  product_id uuid references products,
  quantity  int,
  price     decimal);
```

### Payment Integration

Using **Stripe**:

- Stripe Checkout for secure payments
- Webhook handling for order status
- Refund API integration
- Multiple payment methods

---

## Development Roadmap

### Month 1: XGuard Completion

| Week | Task |
|------|------|
| 1 | Fix auth issues, complete registration flow |
| 2 | Public blog listing, post detail page |
| 3 | Comments section, like button |
| 4 | Testing, bug fixes, polish |

### Month 2: XItem Setup

| Week | Task |
|------|------|
| 1 | Project setup, shared components |
| 2 | Database schema, Stripe integration |
| 3 | Product CRUD, catalog pages |
| 4 | Cart, checkout flow |

### Month 3: XItem Features

| Week | Task |
|------|------|
| 1 | Order management |
| 2 | User accounts |
| 3 | Wishlist, search |
| 4 | Testing, launch |

---

## Shared Utilities

### Components to Reuse

```typescript
// UI Components (shared)
import { Button, Input, Badge, Avatar, Toast, Card } from '@/components/ui'

// Shared hooks
- useAuth()        // Authentication state
- useCart()       // Cart management
- useWishlist()   // Wishlist management

// Utilities
- formatCurrency()
- formatDate()
- slugify()
```

### Migration Notes

When building XItem:

1. Copy `components/ui/*` directly
2. Reuse `lib/supabase/*` setup
3. Extend `tailwind.config.ts` with e-commerce tokens
4. Share authentication between projects

---

## Next Steps

1. **Complete XGuard Phase 1** - Get blog fully working
2. **Set up XItem project** - New Next.js app or clone
3. **Develop in parallel** - Both platforms share patterns

---

*Generated: April 2026*