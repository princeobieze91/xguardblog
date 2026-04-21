import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "XGuard", template: "%s | XGuard" },
  description: "A modern blog platform for ideas that matter.",
  keywords: ["blog", "writing", "content", "articles", "tech", "development"],
  openGraph: {
    title: "XGuard",
    description: "A modern blog platform for ideas that matter.",
    type: "website",
    url: "https://xguardblog-i8gphfden-princeobieze91-6620s-projects.vercel.app",
  },
  alternates: {
    canonical: "https://xguardblog-i8gphfden-princeobieze91-6620s-projects.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="p4HkfOy2U9rJ38jmTwlu_7LsfuMAzCS2NRUrUu25nio" />
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
