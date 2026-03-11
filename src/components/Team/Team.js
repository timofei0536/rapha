"use client";

import "./Team.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";
import { useGeneral } from "@/context/GeneralContext";

export default function Team(props) {
    const { subtitle, title, content, gallery } = props;
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
                            <Btn text={read_more ?? "Read more"} className="btn--orange mobile--hide" href="/about" />
                        </div>
                        <div className="team__gallery">
                            <div className="team__gallery-part team__gallery-part--left">
                                {(gallery?.left ?? []).map((item, i) => (
                                    <Image
                                        key={i}
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        className="team__gallery-img"
                                        width={item.width ?? 434}
                                        height={item.height ?? 412}
                                    />
                                ))}
                            </div>
                            <div className="team__gallery-part team__gallery-part--right">
                                {(gallery?.right ?? []).map((item, i) => (
                                    <Image
                                        key={i}
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        className="team__gallery-img"
                                        width={item.width ?? 434}
                                        height={item.height ?? 224}
                                    />
                                ))}
                            </div>
                        </div>
                        <Btn text={read_more ?? "Read more"} className="btn--orange desktop--hide" href="/about" />
                </div>
            </div>
        </section>    
    );
}