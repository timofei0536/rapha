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
            <p><b>Welcome to the El-Rapha Polyclinic. This October, Breast Cancer Awareness Month, let's join forces in the fight against breast and cervical cancer.</b></p>
            <p style="color: var(--blue-l)">We're offering free services to promote early detection, including:</p>
            <ul>
                <li>Gynecological exam</li>
                <li>Cervical smear</li>
                <li>Breast Exam</li>
            </ul>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque bibendum diam vitae risus molestie, eu pellentesque arcu varius. Duis sollicitudin, ligula pretium ornare mattis, tortor lectus finibus neque, ut imperdiet risus orci et urna. Vestibulum lacinia volutpat feugiat. Nunc ornare eu augue sit amet rutrum. Duis egestas mi ac tortor eleifend vestibulum. Aliquam nec tellus iaculis, rhoncus massa nec, lobortis erat. Sed tincidunt magna vel ante tempor iaculis.</p>
            <p>Ut quam quam, convallis nec neque et, aliquam aliquam purus. Curabitur pretium eu metus in aliquam. Nullam ornare mi massa. Donec quis nulla ac nisl facilisis ornare sed eget tortor. Morbi id bibendum velit.</p>
            <p>Morbi tellus urna, pharetra in velit id, varius rutrum ante. Donec lectus nisi, interdum elementum arcu quis, suscipit dignissim eros. Integer auctor euismod dui eu scelerisque. Donec suscipit tincidunt commodo. Ut ut vestibulum nulla. Cras eu ipsum consectetur, placerat felis sed, accumsan est. Curabitur ante justo, gravida id elit nec, auctor blandit lectus.</p>
            <p>Quisque et erat nec eros iaculis pretium. Integer euismod quam a gravida aliquam. Donec congue augue tellus, vitae cursus diam convallis sit amet. Fusce ullamcorper cursus pretium. Duis nec arcu porta, scelerisque est a, pharetra justo.</p>
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
