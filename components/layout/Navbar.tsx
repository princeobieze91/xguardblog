"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, PenSquare, LayoutDashboard, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/supabase";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [profile, setProfile]     = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen]   = useState(false);
  const router   = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) { setProfile(null); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Home",     href: "/" },
    { label: "Articles", href: "/blog" },
    { label: "About",    href: "/about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
              XGuard
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${pathname === link.href ? "text-primary-500" : "text-dark-600 dark:text-dark-300 hover:text-primary-500"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <>
                <Link href="/dashboard/posts/new">
                  <Button variant="primary" size="sm">
                    <PenSquare className="w-4 h-4" /> Write
                  </Button>
                </Link>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
                    <Avatar name={profile.name} src={profile.avatar_url} size="sm" />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 card-flat rounded-card shadow-xl py-1 z-50"
                      >
                        <div className="px-4 py-2 border-b border-dark-100 dark:border-dark-700">
                          <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{profile.name}</p>
                          <p className="text-xs text-dark-400 truncate">@{profile.username}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href={`/profile/${profile.username}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link href="/blog"><Button variant="primary" size="sm">Articles</Button></Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-input text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block text-dark-700 dark:text-dark-300 hover:text-primary-500 font-medium py-1.5 transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-dark-100 dark:border-dark-800 flex flex-col gap-2">
              {profile ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}><Button variant="secondary" fullWidth>Dashboard</Button></Link>
                  <Button variant="ghost" fullWidth onClick={handleLogout}>Sign out</Button>
                </>
              ) : (
                <>
                  <Link href="/blog" onClick={() => setIsOpen(false)}><Button variant="primary" fullWidth>Articles</Button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
