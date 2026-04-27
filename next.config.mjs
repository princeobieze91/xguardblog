/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com",   pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co",       pathname: "/**" },
      { protocol: "https", hostname: "essorqboloappvfwjcbh.supabase.co",       pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.storage",       pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos",       pathname: "/**" },
      { protocol: "https", hostname: "i.imgur.com",       pathname: "/**" },
      { protocol: "https", hostname: "*.i.imgur.com",       pathname: "/**" },
      { protocol: "https", hostname: "imgflip.com",       pathname: "/**" },
      // Article sources
      { protocol: "https", hostname: "*.theverge.com", pathname: "/**" },
      { protocol: "https", hostname: "*.engadget.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cnet.com", pathname: "/**" },
      { protocol: "https", hostname: "*.macrumors.com", pathname: "/**" },
      { protocol: "https", hostname: "*.techradar.com", pathname: "/**" },
      { protocol: "https", hostname: "*.thenextweb.com", pathname: "/**" },
      { protocol: "https", hostname: "*.9to5mac.com", pathname: "/**" },
      { protocol: "https", hostname: "*.9to5google.com", pathname: "/**" },
      { protocol: "https", hostname: "*.gematsu.com", pathname: "/**" },
      { protocol: "https", hostname: "*.freecodecamp.org", pathname: "/**" },
      { protocol: "https", hostname: "*.cdn.freecodecamp.org", pathname: "/**" },
      // Legacy sources
      { protocol: "https", hostname: "techcrunch.com",   pathname: "/**" },
      { protocol: "https", hostname: "*.techcrunch.com",  pathname: "/**" },
      { protocol: "https", hostname: "*.wired.com", pathname: "/**" },
      { protocol: "https", hostname: "*.arstechnica.com", pathname: "/**" },
      { protocol: "https", hostname: "*.bbcimg.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "*.forbes.com", pathname: "/**" },
      { protocol: "https", hostname: "*.digitaltrends.com", pathname: "/**" },
      { protocol: "https", hostname: "*.newsapi.org", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
