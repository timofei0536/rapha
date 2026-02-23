import { headers } from "next/headers";
import New from "@/components/New/New";
import { NewDefaults } from "@/components/New/defaults";
import { getSingleNewsBySlug } from "@/lib/rapha";

function slugToTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\b24 7\b/i, "24/7");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getSingleNewsBySlug(slug);
  const title = article?.title ?? slugToTitle(slug);
  const strictWp = process.env.NEXT_PUBLIC_STRICT_WP === "true";
  return { title: (typeof title === "string" ? title.replace(/\n/g, " ") : title) || (strictWp ? "" : "News") };
}

export default async function SingleNewsPage({ params }) {
  const { slug } = await params;
  const strictWp = process.env.NEXT_PUBLIC_STRICT_WP === "true";
  const article = await getSingleNewsBySlug(slug);
  const pageTitle = article?.title ?? (strictWp ? "" : slugToTitle(slug));
  const date = article?.date ?? (strictWp ? "" : NewDefaults.date);
  const image = article?.image ?? (strictWp ? null : NewDefaults.image);
  const content = article?.content ?? (strictWp ? "" : NewDefaults.content);

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const shareUrl = `${proto}://${host}/news/${slug}`;

  return (
    <main className="page page--bg-gray">
      <New
        title={pageTitle}
        date={date}
        image={image}
        content={content}
        shareUrl={shareUrl}
      />
    </main>
  );
}
