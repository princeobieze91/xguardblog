import { redirect } from "next/navigation";

// This route (/blog/blog/[slug]) was accidentally nested one level too deep.
// All post detail pages are served at /blog/[slug] via app/(blog)/blog/[slug]/page.tsx.
export default function Page({ params }: { params: { slug: string } }) {
  redirect(`/blog/${params.slug}`);
}
