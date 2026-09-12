import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";
import { getNewsListForPage } from "@/lib/rapha";

export const metadata = {
  title: "News",
  description:
    "News and updates from El-Rapha polyclinic: health campaigns, services, and clinic announcements.",
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
