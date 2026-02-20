import Image from "next/image";
import Link from "next/link";
import "./Service.scss";

export default function Service(props) {
    const {
        services = [],
        activeSlug,
        basePath = "/services",
        defaultImage = "/images/services-screen.png",
    } = props;
    const list = Array.isArray(services) ? services : [];
    const active = list.find((s) => s.slug === activeSlug) ?? list[0];
    // const activeImage = active.image ?? defaultImage;
    const activeImage = "/images/service-screen.png";

    return (
        <section className="service">
            <div className="center-wrap">
                <div className="service__wrap white-header">
                    <div className="center-wrap center-wrap--small">
                    <nav className="service__nav">
                        <ul className="service__list">
                            {list.map((item) => {
                                const isActive = active && item.slug === active.slug;
                                return (
                                    <li key={item.slug} className="service__item">
                                        <Link
                                            href={`${basePath}/${item.slug}`}
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
                                src={activeImage}
                                alt={active?.title ?? ""}
                                width={1250}
                                height={640}
                                className="service__image"
                            />
                            <h2 className="service__title simple-title">{active?.title}</h2>
                    </div>
            </div>
            </div>
            </div>
        </section>
    );
}
