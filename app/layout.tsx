import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/layout/AppWrapper";

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
  description: "A modern blog platform for ideas that matter. Discover insightful articles on development, design, and technology.",
  keywords: ["blog", "writing", "content", "articles", "tech", "development", "web development", "design", "programming"],
  authors: [{ name: "XGuard Team" }],
  creator: "XGuard",
  publisher: "XGuard",
  openGraph: {
    title: "XGuard Blog",
    description: "A modern blog platform for ideas that matter. Discover insightful articles on development, design, and technology.",
    type: "website",
    url: "https://xguardblog.vercel.app",
    siteName: "XGuard",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "XGuard Blog",
    description: "A modern blog platform for ideas that matter.",
    creator: "@xguardblog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://xguardblog.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "XGuard",
    description: "A modern blog platform for ideas that matter.",
    url: "https://xguardblog.vercel.app",
    publisher: {
      "@type": "Organization",
      name: "XGuard",
      logo: {
        "@type": "ImageObject",
        url: "https://xguardblog.vercel.app/logo.png"
      }
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://xguardblog.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="p4HkfOy2U9rJ38jmTwlu_7LsfuMAzCS2NRUrUu25nio" />
        <meta name="msvalidate.01" content="DDAB268DF857BD4C287C440B48244FE1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
