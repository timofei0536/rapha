import { headers } from "next/headers";
import New from "@/components/New/New";
import { getPostSlugs } from "@/lib/rapha";
import { getNewsPageData } from "@/lib/preview";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs;
}

export async function generateMetadata({ params, searchParams }) {
  const resolved = await params;
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getNewsPageData(resolved, searchParams, cookie);
  const strictWp = process.env.NEXT_PUBLIC_STRICT_WP === "true";
  const title = (typeof data.title === "string" ? data.title.replace(/\n/g, " ") : data.title) || (strictWp ? "" : "News");
  return { title };
}

export default async function SingleNewsPage({ params, searchParams }) {
  const resolved = await params;
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getNewsPageData(resolved, searchParams, cookie);
  return (
    <main className="page page--bg-gray">
      <New {...data} />
    </main>
  );
}
