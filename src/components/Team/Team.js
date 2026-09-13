"use client";

import "./Team.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";
import { useGeneral } from "@/context/GeneralContext";

export default function Team(props) {
    const { subtitle, title, content, gallery, link } = props;
    const { read_more } = useGeneral();
    return (
        <section className="team">
            <div className="team__bg" aria-hidden="true" />
            <div className="center-wrap">
                <div className="team__wrap white-header">
                        <div className="team__left">
                            <h2 className="team__small-title simple-title">{subtitle}</h2>
                            <span className="team__title">{title}</span>
                            <div className="team__text content" dangerouslySetInnerHTML={{ __html: content }} />
                            {link?.href ? (
                                <Btn text={link.text || read_more} className="btn--orange mobile--hide" href={link.href} target={link.target} />
                            ) : null}
                        </div>
                        <div className="team__gallery">
                            <div className="team__gallery-part team__gallery-part--left">
                                {(gallery?.left ?? []).filter((item) => item?.image?.src).map((item, i) => (
                                    <div key={i} className="img-parallax team__gallery-img-wrap">
                                        <div className="img-parallax__wrap">
                                            <Image
                                                src={item.image.src}
                                                alt={item.image.alt || ""}
                                                className="team__gallery-img"
                                                width={435}
                                                height={320}
                                                sizes="(max-width: 1023px) 45vw, 43.5rem"
                                                quality={95}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="team__gallery-part team__gallery-part--right">
                                {(gallery?.right ?? []).filter((item) => item?.image?.src).map((item, i) => (
                                    <div key={i} className="img-parallax team__gallery-img-wrap">
                                        <div className="img-parallax__wrap">
                                            <Image
                                                src={item.image.src}
                                                alt={item.image.alt || ""}
                                                className="team__gallery-img"
                                                width={435}
                                                height={320}
                                                sizes="(max-width: 1023px) 45vw, 43.5rem"
                                                quality={95}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {link?.href ? (
                            <Btn text={link.text || read_more} className="btn--orange desktop--hide" href={link.href} target={link.target} />
                        ) : null}
                </div>
            </div>
        </section>    
    );
}