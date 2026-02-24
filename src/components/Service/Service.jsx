import Image from "next/image";
import Link from "next/link";
import "./Service.scss";

function slugFromLink(link) {
  if (!link?.href || typeof link.href !== "string") return null;
  const path = link.href.startsWith("http") ? new URL(link.href).pathname : link.href;
  const segment = path.split("/").filter(Boolean).pop();
  return segment || null;
}

export default function Service(props) {
    const {
        services = [],
        activeSlug,
        activeService,
        basePath = "/services",
        defaultImage = "/images/service-page.png",
    } = props;
    const list = Array.isArray(services) ? services : [];
    const active = activeService ?? list.find((s) => s.slug === activeSlug) ?? list[0];
    const activeImage = active?.image ?? defaultImage;
    const imageSrc = typeof activeImage === "object" && activeImage?.src ? activeImage.src : activeImage;
    const imageAlt = typeof activeImage === "object" && activeImage?.alt != null ? activeImage.alt : (active?.title ?? "");

    return (
        <section className="service">
            <div className="center-wrap">
                <div className="service__wrap white-header">
                    <div className="center-wrap center-wrap--small">
                    <nav className="service__nav">
                        <ul className="service__list">
                            {list.map((item) => {
                                const slug = item.slug ?? slugFromLink(item.link);
                                const href = item.link?.href ?? (slug ? `${basePath}/${slug}` : basePath);
                                const isActive = active && (item.slug === active.slug || slug === (active.slug ?? slugFromLink(active.link)));
                                return (
                                    <li key={slug ?? item.title ?? Math.random()} className="service__item">
                                        <Link
                                            href={href}
                                            className={`service__link ${isActive ? "service__link--active" : ""}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="service__content">
                              <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                              />
                            <h2 className="service__title simple-title">{active?.title}</h2>
                    </div>
            </div>
            </div>
            </div>
        </section>
    );
}
