import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "News",
};

export default async function NewsPage({ searchParams }) {
  const newsProps = await getBlockPropsForPage("news", "news", searchParams);

  return (
    <main>
      <NewsScreen />
      <News {...newsProps} />
    </main>
  );
}
