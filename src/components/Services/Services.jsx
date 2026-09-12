"use client";

import "./Services.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";
import Send from "@/components/ui/icons/Download";
import { useGeneral } from "@/context/GeneralContext";

export default function Services(props) {
    const { title, image, services } = props;
    const { learn_more } = useGeneral();
    return (
        <section className="services">
            <div className="center-wrap">
                <div className="services__list">
                    <div className="services__item services__item--title">
                        <h2 className='simple-title'>{title}</h2>
                        {image?.src ? (
                            <Image src={image.src} alt={image?.alt ?? ""} className="services__item-bg" fill quality={95} />
                        ) : null}
                    </div>
                    {(services || []).map((item, i) => {
                        const titleLines = (item.title ?? "").split("\n");
                        const href = typeof item.link === "string" ? item.link : item.link?.href;
                        const iconSrc = item.icon?.src;
                        const iconAlt = item.icon?.alt || item.title || "";
                        const iconIsSvg = typeof iconSrc === "string" && iconSrc.endsWith(".svg");
                        return (
                            <div key={i} className="services__item">
                                {iconSrc ? (
                                    <div className="services__item-icon">
                                        <Image
                                            src={iconSrc}
                                            alt={iconAlt}
                                            width={58}
                                            height={58}
                                            unoptimized={iconIsSvg}
                                        />
                                    </div>
                                ) : null}
                                <h3 className="services__item-title simple-title">
                                    {titleLines.length > 1 ? titleLines.map((line, j) => <span key={j}>{line}{j < titleLines.length - 1 && <br />}</span>) : item.title}
                                </h3>
                                <div className="services__item-text content" dangerouslySetInnerHTML={{ __html: item.content ?? "" }} />
                                {href && <Btn text={learn_more ?? "Learn more"} className="btn--transparent btn--small" href={href} />}
                            </div>
                        );
                    })}
                </div>
                <div className="services__btns">
                    <Btn
                        text="Catalog"
                        icon={Send}
                        className="btn--blue"
                        href="/cataloge.pdf"
                        download="cataloge.pdf"
                    />
                    <Btn text="All Services" className="btn--blue-l" href="/services" />
                </div>
            </div>
        </section>    
    );
}