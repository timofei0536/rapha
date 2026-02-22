import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";
import { InfraDefaults } from "@/components/Infra/defaults";

export const metadata = {
  title: "News",
};

export default async function NewsPage({ searchParams }) {
  const newsProps = await getBlockPropsForPage("news", "news", searchParams);
  const newsItems = newsProps.items || [];
  const infraItems = (InfraDefaults.items || []).map((item) => ({
    ...item,
    content: item.content ?? "",
  }));
  const allItems = [...newsItems, ...infraItems];

  return (
    <main>
      <NewsScreen />
      <News {...newsProps} items={allItems} />
    </main>
  );
}
