import NewsScreen from "@/components/NewsScreen/NewsScreen";
import News from "@/components/News/News";

export const metadata = {
    title: "News",
};

export default function NewsPage() {
    return (
        <main>
            <NewsScreen />
            <News />
        </main>
    );
}
