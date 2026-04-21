"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LayoutDashboard, FileText, PenSquare, Settings, LogOut, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);

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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 hidden md:flex flex-col z-40">
      <div className="p-6 border-b border-dark-100 dark:border-dark-800">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary-500" />
          <span className="text-lg font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">XGuard</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
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
  );
}