"use client";

import "./Infra.scss";
import Image from "next/image";
import Link from "next/link";
import Btn from "@/components/ui/Btn/Btn";
import { useGeneral } from "@/context/GeneralContext";

export default function Infra(props) {
    const { title, items } = props;
    const { learn_more } = useGeneral();
    return (
        <section className="infra">
            <div className="center-wrap center-wrap--small">
            <h2 className="infra__title simple-title simple-title--center">{title}</h2>
            <div className="infra__list">
                {(items || []).map((item, i) => {
                    const href = item.link?.href;
                    const linkText = item.link?.text || learn_more;
                    return (
                    <div key={i} className="infra__item">
                        {href ? (
                        <Link href={href} className="infra__item-img-wrap" aria-label={item.title} target={item.link?.target}>
                            {item.image?.src ? (
                            <Image 
                                src={item.image.src} 
                                alt={item.image?.alt || item.title || ""} 
                                className="infra__item-img white-header"
                                fill
                                quality={95}
                            />
                            ) : null}
                        </Link>
                        ) : (
                        <div className="infra__item-img-wrap">
                            {item.image?.src ? (
                            <Image 
                                src={item.image.src} 
                                alt={item.image?.alt || item.title || ""} 
                                className="infra__item-img white-header"
                                fill
                                quality={95}
                            />
                            ) : null}
                        </div>
                        )}
                        <h3 className="simple-title infra__item-title">{item.title}</h3>
                        {href ? (
                            <Btn text={linkText} href={href} className="btn--white btn--small" target={item.link?.target} />
                        ) : null}
                    </div>
                );
                })}
            </div>
            </div>
        </section>    
    );
}