import Link from "next/link";
import "./ServiceContent.scss";

export default function ServiceContent({
  content,
  services = [],
  activeSlug,
  basePath = "/services",
}) {
  const list = Array.isArray(services) ? services : [];
  const html = content && String(content).trim();
  const hasButtons = list.length > 0;
  const hasContent = !!html;

  if (!hasButtons && !hasContent) return null;

  return (
    <section className="service-content">
      <div className="center-wrap">
      {hasButtons && (
        <div className="service-content__nav-wrap">
          <div className="center-wrap">
            <nav className="service-content__nav">
              <ul className="service-content__list">
                {list.map((item) => {
                  const isActive = item.slug === activeSlug;
                  return (
                    <li key={item.slug} className="service-content__item">
                      <Link
                        href={`${basePath}/${item.slug}`}
                        className={`service-content__link ${isActive ? "service-content__link--active" : ""}`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
      {hasContent && (
            <div className="service-content__content">
              <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
      )}
      </div>
    </section>
  );
}
