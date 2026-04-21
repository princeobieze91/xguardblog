import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <div className="min-h-screen flex bg-dark-50 dark:bg-dark-950">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
