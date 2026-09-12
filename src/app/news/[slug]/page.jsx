import New from "@/components/New/New";
import { getSingleNewsBySlug, getPostSlugs } from "@/lib/rapha";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getSingleNewsBySlug(slug);
  const pageTitle = typeof article?.title === "string" ? article.title.replace(/\n/g, " ") : article?.title || "";
  const description = String(article?.content || article?.preview || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  return {
    title: pageTitle,
    description: description || `${pageTitle} — news from El-Rapha polyclinic.`,
  };
}

export default async function SingleNewsPage({ params }) {
  const { slug } = await params;
  const article = await getSingleNewsBySlug(slug);
  const pageTitle = article?.title ?? "";
  const date = article?.date ?? "";
  const image = article?.image ?? null;
  const content = article?.content ?? "";

  const baseUrl =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : "";
  const shareUrl = baseUrl ? `${baseUrl}/news/${slug}/` : "";

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
