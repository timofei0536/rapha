import Link from "next/link";
import "./Results.scss";

const DEFAULT_SUBTITLE = "Search results for:";
const DEFAULT_QUERY = "X-ray Services";
const DEFAULT_RESULTS = [
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
    { title: "Lorem ipsum dolor", description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus,", link: { href: "#", target: undefined } },
];

export default function Results({ subtitle = DEFAULT_SUBTITLE, query = DEFAULT_QUERY, items = DEFAULT_RESULTS }) {
    return (
        <section className="results">
            <header className="results__header">
                <div className="center-wrap">
                    <p className="results__subtitle">{subtitle}</p>
                    <h1 className="results__title simple-title simple-title--large">{query}</h1>
                </div>
            </header>
            <div className="center-wrap center-wrap--small">
                <ul className="results__list">
                    {items.map((item, index) => (
                        <li key={index} className="results__item">
                            <h2 className="results__item-title">{item.title}</h2>
                            <p className="results__item-desc">{item.description}</p>
                            <Link
                                href={item.link.href}
                                target={item.link.target}
                                rel={item.link.target === "_blank" ? "noopener noreferrer" : undefined}
                                className="results__item-link link"
                            >
                                Read more
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
