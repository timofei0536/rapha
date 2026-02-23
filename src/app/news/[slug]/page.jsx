import { headers } from "next/headers";
import New from "@/components/New/New";
import { NewDefaults } from "@/components/New/defaults";
import { InfraDefaults } from "@/components/Infra/defaults";
import { NewsDefaults } from "@/components/News/defaults";

/** Slug to display title (e.g. "24-7-ambulance" -> "24/7 Ambulance"). */
function slugToTitle(slug) {
  if (!slug) return "News";
  const withSpaces = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return withSpaces.replace(/\b24 7\b/i, "24/7");
}

/** Find article title and image by slug; content is always the same (NewDefaults). */
function getArticleBySlug(slug) {
  const newsItem = (NewsDefaults.items || []).find((item) => item.slug === slug);
  if (newsItem) {
    return {
      title: newsItem.title,
      image: newsItem.image,
    };
  }
  const infraItem = (InfraDefaults.items || []).find((item) => item.slug === slug);
  if (infraItem) {
    return {
      title: infraItem.title,
      image: infraItem.image,
    };
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.title ?? slugToTitle(slug);
  return { title: (typeof title === "string" ? title.replace(/\n/g, " ") : title) || "News" };
}

export default async function SingleNewsPage({ params }) {
  const { slug } = await params;
  const articleBySlug = getArticleBySlug(slug);
  const fallback = NewDefaults;
  const pageTitle = articleBySlug?.title ?? slugToTitle(slug);
  const image = articleBySlug?.image ?? fallback.image;
  const content = fallback.content;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const shareUrl = `${proto}://${host}/news/${slug}`;

  return (
    <main className="page page--bg-gray">
      <New
        title={pageTitle}
        date={fallback.date}
        image={image}
        content={content}
        shareUrl={shareUrl}
      />
    </main>
  );
}
