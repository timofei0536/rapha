import Image from "next/image";
import Link from "next/link";
import "./Service.scss";

const DEFAULT_SERVICES = [
    { slug: "resuscitation", title: "Resuscitation" },
    { slug: "surgery-operating-room", title: "Surgery & Operating Room" },
    { slug: "emergencies", title: "Emergencies" },
    { slug: "internal-medicine-dialysis", title: "Internal Medicine Dialysis" },
    { slug: "analysis-laboratory", title: "Analysis Laboratory" },
    { slug: "other-specialties", title: "Other Specialties" },
    { slug: "hospitality-catering", title: "Hospitality & Catering" },
    { slug: "medical-imaging", title: "Medical Imaging" },
    { slug: "gynecology-obstetrics", title: "Gynecology-Obstetrics" },
];

export default function Service({
    services = DEFAULT_SERVICES,
    activeSlug,
    basePath = "/services",
    defaultImage = "/images/services-screen.png",
}) {
    const active = services.find((s) => s.slug === activeSlug) ?? services[0];
    // const activeImage = active.image ?? defaultImage;
    const activeImage = "/images/service-page.png";

    return (
        <section className="service">
            <div className="center-wrap">
                <div className="service__wrap">
                    <div className="center-wrap center-wrap--small">
                    <nav className="service__nav">
                        <ul className="service__list">
                            {services.map((item) => {
                                const isActive = item.slug === active.slug;
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
                                alt={active.title}
                                width={1250}
                                height={640}
                                className="service__image"
                            />
                            <h2 className="service__title simple-title">{active.title}</h2>
                    </div>
            </div>
            </div>
            </div>
        </section>
    );
}
