import Link from "next/link";
import {
  Shield,
  Users,
  PenTool,
  Zap,
  Globe,
  Heart,
  MessageCircle,
  Code,
  Rocket,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "Discover why XGuard exists and the mission behind empowering writers worldwide.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 dark:from-dark-950 to-white dark:to-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-dark-900 dark:text-white mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              XGuard
            </span>
          </h1>
          <p className="text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
            Empowering voices, amplifying ideas, and building a platform where
            writers can freely share their knowledge with the world.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-rose-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">P</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-2">
                  Prince F.O
                </h2>
                <p className="text-primary-500 font-semibold mb-4">
                  Founder &amp; Developer
                </p>
                <p className="text-dark-600 dark:text-dark-300 leading-relaxed">
                  A passionate full-stack developer and creative technologist
                  who believes in the power of words to change the world. With
                  years of experience building digital products, Prince created
                  XGuard to solve a fundamental problem: the lack of clean,
                  modern platforms where writers can focus on what matters most
                  — their ideas.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  <span className="badge-primary text-xs">
                    Full-Stack Developer
                  </span>
                  <span className="badge-rose text-xs">UI/UX Enthusiast</span>
                  <span className="badge-green text-xs">
                    Open Source Advocate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why XGuard Exists */}
      <section className="py-16 px-4 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-dark-900 dark:text-white text-center mb-12">
            Why XGuard Exists
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="w-12 h-12 rounded-card bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                The Writer&apos;s Struggle
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                Writers shouldn&apos;t need technical expertise to share their
                knowledge. Existing platforms are cluttered, distracting, and
                take focus away from the writing itself.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 rounded-card bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                Clean Simplicity
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                XGuard strips away the noise. No complicated settings, no
                cluttered interfaces — just a beautiful space to write and
                share.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 rounded-card bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                Democratize Publishing
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                Everyone has a voice worth hearing. XGuard makes it possible for
                anyone to publish their ideas without barriers or gatekeepers.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 rounded-card bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                Community First
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                Building a community of learners and thinkers. XGuard isn&apos;t
                just a blog — it&apos;s a platform for meaningful conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value to the Digital Age */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-dark-900 dark:text-white text-center mb-12">
            Value to the Digital Age
          </h2>
          <div className="space-y-8">
            {[
              {
                icon: Code,
                color: "bg-primary-500",
                title: "Open Source Foundation",
                text: "Built on open-source technologies, XGuard contributes to the developer community while providing transparency and reliability. Users own their data and can migrate anytime.",
              },
              {
                icon: TrendingUp,
                color: "bg-rose-500",
                title: "Knowledge Economy",
                text: "In an era of information overload, quality matters more than quantity. XGuard helps writers produce and organize high-quality content that genuinely helps readers.",
              },
              {
                icon: Heart,
                color: "bg-green-500",
                title: "Human Connection",
                text: "Technology should bring people together, not drive them apart. XGuard fosters genuine discussions through comments, likes, and meaningful interactions.",
              },
              {
                icon: Rocket,
                color: "bg-primary-500",
                title: "Digital Preservation",
                text: "Every great idea deserves to be preserved. XGuard provides a reliable platform where knowledge can live on and help future generations of readers and developers.",
              },
            ].map(({ icon: Icon, color, title, text }) => (
              <div key={title} className="flex gap-6">
                <div
                  className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-500 to-rose-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            To empower every individual with a voice to share their knowledge,
            ideas, and stories with the world — without complexity, without
            barriers, and without compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-500 font-semibold py-3 px-6 rounded-pill hover:bg-white/90 transition-colors"
            >
              Start Writing <MessageCircle className="w-4 h-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold py-3 px-6 rounded-pill hover:bg-white/10 transition-colors"
            >
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mb-6">
            Have questions, suggestions, or just want to say hello? We&apos;d
            love to hear from you.
          </p>
          <a href="mailto:hello@xguard.dev" className="btn-primary inline-flex">
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
