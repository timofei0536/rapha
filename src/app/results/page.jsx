import Results from "@/components/Results/Results";

export const metadata = {
    title: "Search Results",
};

const ResultsDefaults = {
    subtitle: "Search results for:",
    query: "X-ray Services",
    items: [
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
        { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    ],
};

export default function ResultsPage() {
    return (
        <main>
            <Results {...ResultsDefaults} />
        </main>
    );
}
