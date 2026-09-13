"use client";

import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/ui/icons/Decor";
import { getLowResImageSrc, IMAGE_QUALITY } from "@/lib/image-utils";
import { useState } from "react";

export default function Hero(props) {
    const { title, formTitle, image, imageMobile, doctors, insurances, services } = props;
    const desktopSrc = image?.src;
    const mobileSrc = imageMobile?.src;
    const hasSeparateMobile = Boolean(mobileSrc && mobileSrc !== desktopSrc);
    const [blurSrc, setBlurSrc] = useState(() => getLowResImageSrc(desktopSrc));
    const onBlurError = () => {
        if (desktopSrc && blurSrc !== desktopSrc) setBlurSrc(desktopSrc);
    };
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                {blurSrc ? (
                    <Image src={blurSrc} alt="" fill quality={IMAGE_QUALITY} sizes="(max-width: 1023px) 0px, 89rem" onError={onBlurError} />
                ) : null}
            </div>
            <div className="hero__bg">
                <div className="img-parallax img-parallax--fill">
                    <div className="img-parallax__wrap">
                {desktopSrc ? (
                    <Image
                        src={desktopSrc}
                        alt={image?.alt ?? ""}
                        fill
                        priority
                        fetchPriority="high"
                        quality={IMAGE_QUALITY}
                        sizes={hasSeparateMobile ? "(max-width: 1023px) 0px, calc(100vw - 89rem)" : "(max-width: 1023px) 100vw, calc(100vw - 89rem)"}
                        className={`hero__bg-img anim-initial${hasSeparateMobile ? " hero__bg-img--desktop" : ""}`}
                        style={{ "--anim-scale": 1.08 }}
                    />
                ) : null}
                {hasSeparateMobile ? (
                    <Image
                        src={mobileSrc}
                        alt={imageMobile?.alt ?? image?.alt ?? ""}
                        fill
                        priority
                        fetchPriority="high"
                        quality={IMAGE_QUALITY}
                        unoptimized={typeof mobileSrc === "string" && mobileSrc.endsWith(".svg")}
                        sizes="(max-width: 1023px) 100vw, 0px"
                        className="hero__bg-img hero__bg-img--mobile anim-initial"
                        style={{ "--anim-scale": 1.08 }}
                    />
                ) : null}
                    </div>
                </div>
            </div>
            <div className="center-wrap">
                <h1 className="hero__title simple-title simple-title--large anim-initial" style={{ '--anim-opacity': 0 }}>{title}</h1>
                <div className="hero__form">
                    <span className="hero__form-title anim-initial" style={{ '--anim-opacity': 0, '--anim-y': '40px' }}>{formTitle}</span>
                    <Form
                        doctors={doctors}
                        insurances={insurances}
                        services={services}
                        animInitialStyle={{ '--anim-opacity': 0, '--anim-y': '40px' }}
                    />
                </div>
            </div>
            <Decor className='decore' />
        </section>    
    );
}