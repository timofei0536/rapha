import { headers } from "next/headers";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import ServiceContent from "@/components/ServiceContent/ServiceContent";
import { getServicePageData } from "@/lib/preview";
import { getWpServices } from "@/lib/rapha";

export async function generateStaticParams() {
  const services = await getWpServices();
  const slugs = (services || [])
    .map((s) => (s?.slug ? { slug: String(s.slug).trim() } : null))
    .filter(Boolean);
  return slugs.length > 0 ? slugs : [{ slug: "surgery-operating-room" }];
}

export async function generateMetadata({ params, searchParams }) {
  const resolved = await params;
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getServicePageData(resolved, searchParams, cookie);
  return { title: data.pageScreen?.title || "Our Services" };
}

export default async function ServicePage({ params, searchParams }) {
  const resolved = await params;
  const cookie = (await headers()).get("cookie") ?? undefined;
  const data = await getServicePageData(resolved, searchParams, cookie);
  return (
    <main>
      <PageScreen {...data.pageScreen} />
      <ServiceContent content={data.content} services={data.list} activeSlug={data.activeSlug} />
      <Service {...data.serviceProps} services={data.list} activeSlug={data.activeSlug} activeService={data.activeService} />
      <News {...data.newsProps} items={(data.newsProps?.items ?? []).slice(0, 3)} featured={data.featured} />
    </main>
  );
}
