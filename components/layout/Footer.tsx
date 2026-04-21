import Link from "next/link";
import { Shield, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-primary-500" />
              <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">XGuard</span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed max-w-xs">
              A modern blog platform for ideas that matter. Write, share, and discover great content.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-500 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[["Blog", "/blog"], ["Write", "/dashboard/posts/new"], ["About", "/about"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-dark-400 hover:text-primary-500 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              {[["Sign In", "/login"], ["Register", "/register"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-dark-400 hover:text-primary-500 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-800 mt-8 pt-8 text-center text-xs text-dark-500">
          © {new Date().getFullYear()} XGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
