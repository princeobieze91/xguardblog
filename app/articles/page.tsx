import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const articles = [
  {
    slug: "ai-driven-workflows-agentic-uis",
    title: "AI-Driven Workflows & Agentic UIs",
    excerpt:
      "The software development landscape is undergoing a seismic shift. We're moving beyond simple code generation into a new paradigm where AI agents act as full team orchestrators...",
    category: "Technology",
    date: "January 2026",
    readTime: 8,
  },
  {
    slug: "server-first-performance-rsc",
    title: "Server-First Performance & React Server Components",
    excerpt:
      "After years of pushing complexity to the client, developers are rediscovering the power of server-side rendering. React Server Components have fundamentally changed how we think about web performance...",
    category: "Technology",
    date: "February 2026",
    readTime: 7,
  },
  {
    slug: "on-device-ai-multimodal",
    title: "On-Device AI and Multimodal Models",
    excerpt:
      "The cloud is no longer the only place where AI lives. A quiet revolution is happening on your device—local AI models are becoming powerful enough to handle complex tasks without ever touching a server...",
    category: "Technology",
    date: "March 2026",
    readTime: 6,
  },
  {
    slug: "nobody-knows-how-to-build-with-ai",
    title: '"Nobody Knows How To Build With AI Yet"',
    excerpt:
      "I've been watching developers chase AI tools like rabbits chase carrots. But here's the uncomfortable truth: nobody knows how to build with AI yet. We celebrate impressive. Users need useful...",
    category: "Opinion",
    date: "April 2026",
    readTime: 5,
  },
  {
    slug: "mcp-design-to-code",
    title: "Model Context Protocol (MCP) for Design-to-Code",
    excerpt:
      "What if your AI could read Figma designs directly and generate production-ready code? That's exactly what Model Context Protocol enables...",
    category: "Tutorial",
    date: "May 2026",
    readTime: 7,
  },
  {
    slug: "end-of-dashboards-design-systems",
    title: "The End of Dashboards & Design Systems",
    excerpt:
      "Design systems promised consistency. Dashboards promised data-driven decisions. In 2026, we're realizing both have failed us. Welcome to the era of human-centric design...",
    category: "Design",
    date: "June 2026",
    readTime: 6,
  },
  {
    slug: "edge-computing-defaults",
    title: "Edge Computing Defaults",
    excerpt:
      "The future of computing isn't in the cloud—it's at the edge. In 2026, processing logic is moving closer to users, eliminating latency and improving privacy...",
    category: "Technology",
    date: "July 2026",
    readTime: 7,
  },
  {
    slug: "legal-accessibility-mandates",
    title: "Legal Accessibility Mandates: The New MVP Requirement",
    excerpt:
      "AI-generated code is flooding the web with inaccessible interfaces. Meanwhile, global regulations are making accessibility a legal requirement. In 2026, a11y isn't optional—it's the law...",
    category: "Technology",
    date: "August 2026",
    readTime: 8,
  },
  {
    slug: "fine-tuning-serverless-gpus",
    title: "Fine-Tuning Models with Serverless GPUs",
    excerpt:
      "You don't need a GPU farm to fine-tune AI models. With serverless GPU infrastructure, you can train specialized models on-demand—paying only for what you use...",
    category: "Tutorial",
    date: "September 2026",
    readTime: 9,
  },
  {
    slug: "rise-of-green-coding",
    title: 'The Rise of "Green Coding" in Modern Software',
    excerpt:
      "The tech industry produces 4% of global CO2 emissions—more than aviation. In 2026, developers are finally waking up to their environmental responsibility...",
    category: "Opinion",
    date: "October 2026",
    readTime: 6,
  },
];

const categories = [
  { name: "Technology", color: "#6C63FF" },
  { name: "Opinion", color: "#FF6584" },
  { name: "Tutorial", color: "#10b981" },
  { name: "Design", color: "#3b82f6" },
];

export default function ArticlesPage() {
  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-b from-primary-50 dark:from-dark-950 to-white dark:to-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400">
            10 trending development articles for 2026
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <span
              key={cat.name}
              className="px-3 py-1 rounded-pill text-xs font-semibold"
              style={{ backgroundColor: cat.color + "20", color: cat.color }}
            >
              {cat.name}
            </span>
          ))}
        </div>

        <div className="space-y-6">
          {articles.map((article, idx) => {
            const cat = categories.find((c) => c.name === article.category);
            return (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="card block p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-400 font-bold text-lg">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: cat?.color + "20",
                          color: cat?.color,
                        }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-dark-400">
                        {article.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-dark-600 dark:text-dark-400 text-sm mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} min read
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
