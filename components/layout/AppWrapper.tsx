"use client";

import { usePathname } from "next/navigation";
import { checkIsDashboard } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = checkIsDashboard(pathname);

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}