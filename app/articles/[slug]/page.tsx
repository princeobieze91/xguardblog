import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface ArticleData {
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  author: string;
  readTime: number;
  content: string;
  excerpt?: string;
}

const articlesData: Record<string, ArticleData> = {
  "ai-driven-workflows-agentic-uis": {
    title: "AI-Driven Workflows & Agentic UIs",
    category: "Technology",
    categoryColor: "#6C63FF",
    date: "January 2026",
    author: "Prince F.O",
    readTime: 8,
    content: `The software development landscape is undergoing a seismic shift. We're moving beyond simple code generation into a new paradigm where AI agents act as full team orchestrators, managing complex workflows with minimal human intervention.

## The Rise of Agentic Frameworks

Remember when AI coding assistants were just fancy autocomplete tools? Those days are over. Frameworks like **BMAD (Base Model Agentic Director)** are now orchestrating entire development teams, assigning tasks to specialized AI agents, reviewing code, and managing project timelines.

\`\`\`
Traditional Development:
Human → Code → Review → Deploy

Agentic Development:
Human → Agent Orchestrator → [Design Agent + Code Agent + Test Agent] → Review → Deploy
\`\`\`

## What Makes an Agentic UI?

Agentic UIs differ fundamentally from traditional interfaces:

- **Adaptive**: UI changes based on user intent, not just clicks
- **Predictive**: Anticipates next actions before you make them
- **Conversational**: Natural language replaces rigid form inputs
- **Autonomous**: Can execute complex multi-step tasks independently

## The BMAD Architecture

BMAD represents the next evolution in AI development:

1. **Intent Parser** - Understands high-level user goals
2. **Task Decomposer** - Breaks goals into executable subtasks
3. **Agent Pool** - Specialized AI agents for different functions
4. **Orchestrator** - Coordinates agent collaboration
5. **Feedback Loop** - Continuous learning and improvement

## Practical Applications

Consider a simple feature request: "Add dark mode to the dashboard."

In the old paradigm, you'd:
1. Open the design file
2. Create dark mode tokens
3. Update all components
4. Test across pages

With agentic UIs, you simply state your intent, and the AI:
1. Scans your codebase
2. Identifies all theme-related components
3. Generates theme variations
4. Updates all references
5. Runs tests automatically
6. Creates PR with documentation

## The Human Role

As AI handles execution, developers become **architects and reviewers**. Our role shifts to:

- Defining clear requirements
- Validating AI output
- Making architectural decisions
- Focusing on edge cases AI might miss

## Looking Ahead

The agentic UI revolution isn't coming—it's here. Companies adopting these frameworks are seeing 10x productivity gains. The question isn't whether to adopt agentic development, but how quickly you can adapt.

The future belongs to developers who can effectively collaborate with AI agents, not compete against them.`,
  },
  "server-first-performance-rsc": {
    title: "Server-First Performance & React Server Components",
    category: "Technology",
    categoryColor: "#6C63FF",
    date: "February 2026",
    author: "Prince F.O",
    readTime: 7,
    content: `The pendulum has swung. After years of pushing complexity to the client, developers are rediscovering the power of server-side rendering. **React Server Components (RSC)** have fundamentally changed how we think about web performance.

## The Problem with Client-Side JavaScript

Traditional React applications suffer from a fundamental flaw:

\`\`\`
User Request → Server Sends HTML + JS → Browser Downloads JS → JS Hydrates → Interactive
\`\`\`

That hydration step? It's expensive. A 500KB React bundle can take 2-3 seconds to hydrate on mid-range devices.

## Enter Server Components

RSC flips the model:

\`\`\`
User Request → Server Renders Complete HTML → Browser Displays Instantly
\`\`\`

No JavaScript shipped to the client for static content. Zero hydration. Instant interactivity.

## How Next.js 14 Makes It Possible

Next.js 14's App Router is built around RSC by default:

\`\`\`tsx
// This runs ONLY on the server
async function PostList() {
  const posts = await db.posts.findMany();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

The component runs on the server, renders HTML, and sends nothing but HTML to the client.

## The Performance Gains

Real-world results from migrating to RSC:

| Metric | Before | After |
|--------|--------|-------|
| First Contentful Paint | 1.8s | 0.4s |
| Time to Interactive | 3.2s | 0.6s |
| Bundle Size | 480KB | 42KB |
| JavaScript Transferred | 420KB | 12KB |

## When to Use Client Components

Not everything belongs on the server. Use 'use client' for:

- Interactive event handlers (onClick, onChange)
- useState and useEffect
- Browser-only APIs
- Third-party components relying on client-side state

## The Architecture Shift

Server-first doesn't mean "no client code." It means:

1. **Default to server** - Render everything on the server
2. **Selective hydration** - Only ship JS for interactive parts
3. **Streaming** - Progressive enhancement with Suspense

## The Future is Server-First

The era of heavy client-side frameworks is ending. Server-first performance isn't a trend—it's a return to fundamentals.`,
  },
  "on-device-ai-multimodal": {
    title: "On-Device AI and Multimodal Models",
    category: "Technology",
    categoryColor: "#6C63FF",
    date: "March 2026",
    author: "Prince F.O",
    readTime: 6,
    content: `The cloud is no longer the only place where AI lives. A quiet revolution is happening on your device—local AI models are becoming powerful enough to handle complex tasks without ever touching a server.

## The Cloud AI Problem

Every API call to OpenAI, Anthropic, or Google costs money and adds latency. For privacy-sensitive applications, this is a non-starter.

## Enter On-Device AI

Google's **Edge Gallery** and **Gemma 4** represent a new paradigm:

- **Zero latency** - No network requests
- **Complete privacy** - Data never leaves the device
- **Offline capability** - Works without internet
- **Cost-free** - No API bills

## What Can Local Models Do?

Modern on-device models can handle:

| Task | Model Size | Performance |
|------|-----------|--------------|
| Text generation | 2-4GB | 40 tokens/sec |
| Image understanding | 3GB | 200ms/ image |
| Code completion | 1GB | Real-time |
| Speech recognition | 500MB | <100ms |

## Practical Applications

Build privacy-first applications:

- **Personal AI assistant** - Your data stays yours
- **Offline productivity** - Work without connectivity
- **Enterprise security** - No data leaves corporate devices

## The Hybrid Future

Most applications will use both:

\`\`\`
User Query → Local Model (fast)
          → Complex queries → Cloud API (capable)
          → Combined Result
\`\`\`

This gives the best of both worlds: speed for simple tasks, power for complex ones.`,
  },
  "nobody-knows-how-to-build-with-ai": {
    title: '"Nobody Knows How To Build With AI Yet"',
    category: "Opinion",
    categoryColor: "#FF6584",
    date: "April 2026",
    author: "Prince F.O",
    readTime: 5,
    content: `I've been watching developers chase AI tools like rabbits chase carrots. But here's the uncomfortable truth: **nobody knows how to build with AI yet.**

## The Herd Mentality

Every developer is racing to implement the latest AI feature:

- "We're using CrewAI for our workflow!"
- "Our app has autoGPT integration!"
- "We're building agents!"

But ask them: **Does it actually help users?**

Crickets.

## The Impressive vs. The Useful

There's a crucial difference:

| Impressive | Useful |
|------------|--------|
| AI writes entire apps | AI helps debug faster |
| Auto-generates 1000s of lines | Refactors 50 lines clearly |
| Creates "smart" agents | Answers user questions accurately |

## A Better Framework

Before adding AI to your next project, answer:

1. **What specific user problem does AI solve?**
2. **How does this improve the user's life?**
3. **What's the simplest solution without AI?**

If you can't answer these clearly, you're not ready to build with AI.

## The Call to Action

Stop following the herd. Start building useful things.

The developers who succeed won't be the ones who used the most AI. They'll be the ones who solved the most problems.`,
  },
  "mcp-design-to-code": {
    title: "Model Context Protocol (MCP) for Design-to-Code",
    category: "Tutorial",
    categoryColor: "#10b981",
    date: "May 2026",
    author: "Prince F.O",
    readTime: 7,
    content: `What if your AI could read Figma designs directly and generate production-ready code? That's exactly what **Model Context Protocol (MCP)** enables.

## The Design-to-Code Problem

Traditional handoffs are broken:

\`\`\`
Designer (Figma) → Specification Doc → Developer → Code
\`\`\`

## Enter MCP Servers

MCP servers allow AI agents to read directly from design sources:

\`\`\`typescript
const mcp = new MCPClient({
  server: 'figma',
  apiKey: process.env.FIGMA_TOKEN
});

const design = await mcp.read({
  fileId: 'abc123',
  nodeId: '1:2'
});
\`\`\`

## How MCP Works

MCP enables bidirectional communication:

1. **AI reads design** - Understand component structure
2. **AI reads dependencies** - See design tokens, variants
3. **AI generates code** - Production-ready React/Next.js
4. **AI reports back** - Syncs changes to design

## The Future of Design Handoffs

MCP represents a fundamental shift:

- **No more "pixel perfect" discussions**
- **Design intent preserved exactly**
- **Faster iteration cycles**
- **True design-code parity**`,
  },
  "end-of-dashboards-design-systems": {
    title: "The End of Dashboards & Design Systems",
    category: "Design",
    categoryColor: "#3b82f6",
    date: "June 2026",
    author: "Prince F.O",
    readTime: 6,
    content: `Design systems promised consistency. Dashboards promised data-driven decisions. In 2026, we're realizing both have failed us. Welcome to the era of **human-centric design**.

## The Design System Trap

We've spent years building "comprehensive" design systems:

- 47 button variants
- 23 typography scales
- 156 color tokens

The result? **Designers drowning in options.**

## Dashboard Fatigue

Every app has the same dashboard:

- Revenue metrics
- User growth charts
- Activity feeds

They're all the same because they're all built from the same design systems.

## The Human-Centric Shift

Human-centric design asks different questions:

| Old (System-Centric) | New (Human-Centric) |
|---------------------|---------------------|
| How consistent is our UI? | Does this help users achieve their goal? |
| Are we using our design tokens? | Does this feel natural to the user? |

## What Replaces Design Systems?

**Intentional simplicity**:

1. **Task-First Components** - Designed for specific user tasks
2. **Contextual Design** - UI adapts to user context
3. **Progressive Disclosure** - Show only what matters

## The Business Case

Human-centric design isn't just ethical—it's practical:

- **Faster development** - Fewer components to build
- **Better user outcomes** - People actually achieve goals
- **Differentiated products** - Stand out from clone interfaces`,
  },
  "edge-computing-defaults": {
    title: "Edge Computing Defaults",
    category: "Technology",
    categoryColor: "#6C63FF",
    date: "July 2026",
    author: "Prince F.O",
    readTime: 7,
    content: `The future of computing isn't in the cloud—it's at the edge. In 2026, processing logic is moving closer to users, eliminating latency and improving privacy.

## The Latency Problem

Every millisecond counts:

| Action | Perceived Delay |
|--------|----------------|
| Instant | < 100ms |
| Fast | 100-300ms |
| Noticeable | 300-1000ms |
| Waiting | > 1s |

Traditional cloud architecture adds 50-500ms of latency per request.

## Edge Computing Explained

Edge computing moves computation closer to users:

\`\`\`
Traditional:
User → Internet → Cloud Server → Internet → User
     ↑ 100ms                     ↑ 100ms

Edge:
User → Edge Server → Edge Server → User
   ↑ 10ms                   ↑ 10ms
\`\`\`

## What Can Run on Edge?

| Task | Edge Capable |
|------|---------------|
| Authentication | ✅ JWT validation |
| Static rendering | ✅ Full HTML |
| API proxies | ✅ Request transformation |
| A/B testing | ✅ Feature flags |

## The End of Loading States

When everything runs at edge, loading states become rare:

- **Instant page loads** - Edge HTML
- **No spinners** - Stale-while-revalidate
- **Progressive enhancement** - Works without JS`,
  },
  "legal-accessibility-mandates": {
    title: "Legal Accessibility Mandates: The New MVP Requirement",
    category: "Technology",
    categoryColor: "#6C63FF",
    date: "August 2026",
    author: "Prince F.O",
    readTime: 8,
    content: `AI-generated code is flooding the web with inaccessible interfaces. In 2026, **a11y isn't optional—it's the law.**

## The Accessibility Crisis

AI code generators produce fast, cheap, inaccessible code:

- Missing ARIA labels
- Improper heading structures
- No keyboard navigation
- Low contrast ratios

## Global Regulatory Landscape

Accessibility mandates are tightening worldwide:

| Region | Regulation | Enforcement |
|--------|------------|-------------|
| EU | European Accessibility Act | €50M+ fines |
| US | ADA | Private lawsuits |
| UK | Equality Act 2010 | Judicial reviews |

## The Business Case

Accessibility lawsuits are exploding:

- **2024**: 4,000+ ADA lawsuits filed
- **2025**: 8,000+ lawsuits
- **2026**: Projected 15,000+

Average settlement: **$50,000 - $250,000**

## The New MVP Checklist

Before shipping any project:

- [ ] All images have alt text
- [ ] Proper heading hierarchy
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] Forms have proper labels
- [ ] Focus states are visible`,
  },
  "fine-tuning-serverless-gpus": {
    title: "Fine-Tuning Models with Serverless GPUs",
    category: "Tutorial",
    categoryColor: "#10b981",
    date: "September 2026",
    author: "Prince F.O",
    readTime: 9,
    content: `You don't need a GPU farm to fine-tune AI models. With serverless GPU infrastructure, you can train specialized models on-demand—paying only for what you use.

## The Case for Fine-Tuning

Pre-trained models are generalists. Fine-tuning makes them specialists:

| Approach | Use Case | Cost |
|----------|-----------|------|
| Prompt engineering | Quick experiments | $0 |
| Fine-tuning | Domain expertise | $50-500 |
| Training from scratch | Unique capabilities | $10,000+ |

## Serverless GPU Options

Major cloud providers now offer on-demand GPU training:

| Provider | GPU | Price/Hour |
|----------|-----|-------------|
| Cloud Run Jobs | RTX 6000 Pro | $0.90 |
| Lambda Labs | A100 | $1.29 |
| Paperspace | A6000 | $0.60 |

## The LoRA Revolution

LoRA (Low-Rank Adaptation) makes fine-tuning accessible:

- **Small adapters** - Only 1-5% of model size
- **Fast training** - Hours not days
- **Cheap** - $50-200 per model
- **Portable** - Swap adapters easily

## When to Fine-Tune

Fine-tune when you need:

- Domain-specific knowledge
- Custom output format
- Specialized behavior

Don't fine-tune when:

- General knowledge suffices
- Quick experiment
- Small dataset (<100 examples)`,
  },
  "rise-of-green-coding": {
    title: 'The Rise of "Green Coding" in Modern Software',
    category: "Opinion",
    categoryColor: "#FF6584",
    date: "October 2026",
    author: "Prince F.O",
    readTime: 6,
    content: `The tech industry produces 4% of global CO2 emissions—more than aviation. In 2026, developers are finally waking up to their environmental responsibility. Welcome to **green coding**.

## The Environmental Cost of Code

Every line of code has an environmental impact:

| Action | CO2 Equivalent |
|--------|---------------|
| Training GPT-4 | 552 tons CO2 |
| Running a cloud server (year) | 500-1000 kg CO2 |
| JavaScript bundle (500KB) | 0.5-2g CO2 |

## What is Green Coding?

Green coding is writing software that:

- **Uses less energy** - Efficient algorithms
- **Transfers less data** - Smaller payloads
- **Processes fewer cycles** - Lazy evaluation
- **Scales appropriately** - Right-sized infrastructure

## Optimization Strategies

### 1. Ship Less JavaScript

\`\`\`typescript
// Instead of importing entire library
import { format } from 'date-fns';

// Import only what's needed
import format from 'date-fns/esm/format';
\`\`\`

### 2. Use Modern Formats

| Format | Size Reduction |
|--------|---------------|
| Brotli vs gzip | 20% smaller |
| WebP vs JPEG | 30-50% smaller |

## Green Coding Principles

1. **Ship less** - Minimal dependencies
2. **Transfer less** - Compress and optimize
3. **Compute less** - Cache aggressively
4. **Scale appropriately** - Right-sized infrastructure
5. **Measure everything** - You can't improve what you don't measure

## Your Action Plan

Start today:

1. **Audit your bundle** - What do you really need?
2. **Enable compression** - Brotli everywhere
3. **Choose green hosting** - Verify provider commitments
4. **Implement caching** - Reduce redundant work

The planet—and your users—will thank you.`,
  },
};

export async function generateStaticParams() {
  return Object.keys(articlesData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = articlesData[params.slug];
  if (!article) return { title: "Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData[params.slug];
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-500 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          className="px-3 py-1 rounded-pill text-xs font-semibold"
          style={{
            backgroundColor: article.categoryColor + "20",
            color: article.categoryColor,
          }}
        >
          {article.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-dark-400">
          <Calendar className="w-3 h-3" />
          {article.date}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-display text-dark-900 dark:text-white mb-6">
        {article.title}
      </h1>

      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dark-100 dark:border-dark-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-rose-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
            {article.author}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-dark-400">
          <Clock className="w-3 h-3" />
          {article.readTime} min read
        </span>
      </div>

      <div className="prose-xguard dark:prose-invert max-w-none">
        {article.content.split("\n").map((line: string, i: number) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-xl font-bold mt-8 mb-4">
                {line.replace("## ", "")}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("```")) {
            return null;
          }
          if (line.startsWith("|")) {
            return (
              <p key={i} className="font-mono text-sm">
                {line}
              </p>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-4">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.trim() === "") {
            return <br key={i} />;
          }
          return (
            <p key={i} className="mb-4">
              {line}
            </p>
          );
        })}
      </div>
    </article>
  );
}
