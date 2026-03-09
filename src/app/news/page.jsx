import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";
import { getNewsListForPage } from "@/lib/rapha";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News",
};

export default async function NewsPage() {
  const { pageTitle, featured, items } = await getNewsListForPage();

  return (
    <main>
      <NewsScreen featured={featured} pageTitle={pageTitle} />
      <News title="News" items={items} hideTitle hideMoreButton />
    </main>
  );
}
