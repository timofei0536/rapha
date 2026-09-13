import New from "@/components/New/New";
import { getSingleNewsBySlug, getPostSlugs } from "@/lib/rapha";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs;
}

function siteUrl() {
  return typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "";
}

function articleDescription(article, pageTitle) {
  return String(article?.content || article?.preview || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155) || `${pageTitle} — news from El-Rapha polyclinic.`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getSingleNewsBySlug(slug);
  const pageTitle = typeof article?.title === "string" ? article.title.replace(/\n/g, " ") : article?.title || "";
  const description = articleDescription(article, pageTitle);
  const url = siteUrl() ? `${siteUrl()}/news/${slug}/` : undefined;
  const image = article?.image?.src;
  return {
    title: pageTitle,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: pageTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SingleNewsPage({ params }) {
  const { slug } = await params;
  const article = await getSingleNewsBySlug(slug);
  const pageTitle = article?.title ?? "";
  const date = article?.date ?? "";
  const image = article?.image ?? null;
  const content = article?.content ?? "";

  const shareUrl = siteUrl() ? `${siteUrl()}/news/${slug}/` : "";

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
