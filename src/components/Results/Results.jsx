import Link from "next/link";
import "./Results.scss";

export default function Results(props) {
  const { subtitle, query, items } = props;
  const list = items || [];
  const hasQuery = typeof query === "string" && query.trim().length > 0;
  const isEmpty = list.length === 0;

  return (
    <section className="results">
      <header className="results__header">
        <div className="center-wrap">
          <p className="results__subtitle">{subtitle || "Search results for:"}</p>
          <h1 className="results__title simple-title simple-title--large">
            {hasQuery ? query : "Search"}
          </h1>
        </div>
      </header>
      <div className="center-wrap center-wrap--small">
        <ul className="results__list">
          {!hasQuery && (
            <li className="results__item">
              <p className="results__empty">Please enter a search term above to find pages, news and services.</p>
            </li>
          )}
          {hasQuery && isEmpty && (
            <li className="results__item">
              <p className="results__empty">No results found for &ldquo;{query}&rdquo;. Please try different words.</p>
            </li>
          )}
          {hasQuery && !isEmpty &&
            list.map((item, index) => (
              <li key={index} className="results__item">
                <h2 className="results__item-title">{item.title}</h2>
                {item.description ? (
                  <p className="results__item-desc">{item.description}</p>
                ) : null}
                <Link
                  href={item.link?.href ?? "#"}
                  target={item.link?.target}
                  rel={item.link?.target === "_blank" ? "noopener noreferrer" : undefined}
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
