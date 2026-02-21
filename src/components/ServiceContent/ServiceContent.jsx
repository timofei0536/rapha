import Btn from "@/components/ui/Btn/Btn";
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
      {hasButtons && (
        <div className="service-content__nav-wrap">
          <div className="center-wrap">
            <nav className="service-content__nav">
              <ul className="service-content__list">
                {list.map((item) => {
                  const isActive = item.slug === activeSlug;
                  return (
                    <li key={item.slug} className="service-content__item">
                      <Btn
                        text={item.title}
                        href={`${basePath}/${item.slug}`}
                        className={`service-content__btn ${isActive ? "service-content__btn--active" : ""}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
      {hasContent && (
        <div className="center-wrap">
          <div className="service-content__wrap center-wrap center-wrap--small">
            <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      )}
    </section>
  );
}
