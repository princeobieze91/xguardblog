"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LayoutDashboard, FileText, PenSquare, Settings, LogOut, Newspaper, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };
    checkRole();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText,        label: "My Posts", href: "/dashboard/posts" },
    ...(isAdmin ? [
      { icon: PenSquare, label: "Write", href: "/dashboard/posts/new" },
      { icon: Newspaper, label: "Articles", href: "/dashboard/articles" }
    ] : []),
    { icon: Settings,        label: "Settings", href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-dark-900 rounded-lg shadow-lg border border-dark-200 dark:border-dark-700"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 flex flex-col z-40 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-dark-100 dark:border-dark-800">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-500" />
            <span className="text-lg font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">XGuard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-100 dark:border-dark-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-input text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}