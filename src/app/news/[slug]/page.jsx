import New from "@/components/New/New";
import News from "@/components/News/News";

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
    const article = {
        title: "Pink October at El-Rapha",
        date: "31st October 2025",
        image: { src: "/images/news-page.png", alt: "Pink October at El-Rapha" },
        content: `
            <p>Welcome to the El-Rapha Polyclinic. This October, Breast Cancer Awareness Month, let's join forces in the fight against breast and cervical cancer. We're offering free services to promote early detection, including: Gynecological exam, Cervical smear, Breast Exam.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.</p>
        `,
    };

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
