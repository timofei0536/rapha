import New from "@/components/New/New";
import { NewDefaults } from "@/components/New/defaults";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return { title: title || "News" };
}

export default async function SingleNewsPage({ params }) {
  const { slug } = await params;
  // TODO: fetch article by slug
  const article = NewDefaults;

  return (
    <main className="page page--bg-gray">
      <New
        title={article.title}
        date={article.date}
        image={article.image}
        content={article.content}
      />
    </main>
  );
}
