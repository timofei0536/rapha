"use client";

import "./NewsScreen.scss";
import Image from "next/image";
import Link from "next/link";
import Decor from "@/components/ui/icons/Decor";
import { useGeneral } from "@/context/GeneralContext";

export default function NewsScreen({ featured, pageTitle }) {
    const { read_more } = useGeneral();
    const image = featured?.image?.src
        ? { src: featured.image.src, alt: featured.image.alt ?? "" }
        : null;
    const slug = featured?.slug || "";
    const href = slug ? `/news/${slug}` : "/news";

    return (
        <section className="news-screen">
            <div className="center-wrap center-wrap--small">
            <div className="news-screen__wrap">
                <h1 className="news-screen__title simple-title simple-title--large">{pageTitle ?? ""}</h1>
                <div className="news-screen__right">
                    <div className="news-screen__content">
                        <span className="news-screen__content-subtitle">Featured News</span>
                        {featured?.title && (
                            <h2 className="news-screen__content-title simple-title">
                                {featured.title}
                            </h2>
                        )}
                        {featured?.preview && (
                            <div className="news-screen__content-text content" dangerouslySetInnerHTML={{ __html: featured.preview }} />
                        )}
                        <Link href={href} className="news-screen__link link">
                            {read_more ?? "Read more"}
                        </Link>
                    </div>
                    {image && (
                        <Link href={href} className="news-screen__img img-wrap" style={{ aspectRatio: "1/1" }}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                            />
                        </Link>
                    )}
                </div>
            </div>
            </div>
            <Decor className="decore decore--blue" aria-hidden="true" />
        </section>
    );
}
