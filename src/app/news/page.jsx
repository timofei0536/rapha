import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";
import { NewsDefaults } from "./news-defaults";

export const metadata = {
  title: "News",
};

export default function NewsPage() {
    return (
        <main>
            <NewsScreen />
            <News {...NewsDefaults} />
        </main>
    );
}
