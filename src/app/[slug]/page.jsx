import { headers } from "next/headers";
import { notFound } from "next/navigation";
import TextPage from "@/components/TextPage/TextPage";
import { getTextPageData } from "@/lib/preview";

const RESERVED_SLUGS = new Set(["not-found", "404"]);

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return { title: "Not found" };
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getTextPageData({ slug }, searchParams, cookie);
  return { title: data?.title || slug || "Preview" };
}

export default async function DynamicPage({ params, searchParams }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getTextPageData({ slug }, searchParams, cookie);
  if (!data) notFound();
  return (
    <main className="page page--bg-gray">
      <TextPage title={data.title || undefined} content={data.content || undefined} />
    </main>
  );
}
