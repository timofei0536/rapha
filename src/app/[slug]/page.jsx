import { notFound } from "next/navigation";
import TextPage from "@/components/TextPage/TextPage";
import { getPageBySlug } from "@/lib/wp-api";
import { normalizeContent } from "@/lib/acf";

export const dynamic = "force-dynamic";

const RESERVED_SLUGS = new Set(["not-found", "404"]);

/** Декодируем HTML-сущности в заголовке из WP (например &#038; → &). */
function decodeTitle(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .trim();
}

function getTitle(page) {
  const raw = page?.title?.rendered ?? page?.acf?.pageTitle ?? "";
  return decodeTitle(typeof raw === "string" ? raw : String(raw || ""));
}

function getContent(page) {
  const acf = page?.acf && typeof page.acf === "object" ? page.acf : {};
  const fromAcf = normalizeContent(acf.pageContent);
  if (fromAcf) return fromAcf;
  const rendered = page?.content?.rendered;
  return rendered ? String(rendered).trim() : "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return { title: "Not found" };
  const page = await getPageBySlug(slug);
  const title = getTitle(page) || slug;
  return { title };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) notFound();

  const page = await getPageBySlug(slug);
  if (!page || typeof page !== "object") notFound();

  const title = getTitle(page);
  const content = getContent(page);

  return (
    <main className="page page--bg-gray">
      <TextPage title={title || undefined} content={content || undefined} />
    </main>
  );
}
