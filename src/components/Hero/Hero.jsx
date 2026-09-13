"use client";

import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/ui/icons/Decor";
import { IMAGE_QUALITY } from "@/lib/image-utils";

export default function Hero(props) {
    const { title, formTitle, image, imageMobile, doctors, insurances, services } = props;
    const desktopSrc = image?.src;
    const mobileSrc = imageMobile?.src;
    const hasSeparateMobile = Boolean(mobileSrc && mobileSrc !== desktopSrc);
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                {desktopSrc ? (
                    <Image src={desktopSrc} alt="" fill quality={IMAGE_QUALITY} sizes="50vw" />
                ) : null}
            </div>
            <div className="hero__bg">
                <div className="img-parallax img-parallax--fill">
                    <div className="img-parallax__wrap">
                {desktopSrc ? (
                    <div className={`hero__bg-slot${hasSeparateMobile ? " hero__bg-slot--desktop" : ""}`}>
                        <Image
                            src={desktopSrc}
                            alt={image?.alt ?? ""}
                            fill
                            priority
                            fetchPriority="high"
                            quality={IMAGE_QUALITY}
                            sizes="(max-width: 1023px) 100vw, 70vw"
                            className="hero__bg-img anim-initial"
                            style={{ "--anim-scale": 1.08 }}
                        />
                    </div>
                ) : null}
                {hasSeparateMobile ? (
                    <div className="hero__bg-slot hero__bg-slot--mobile">
                        <Image
                            src={mobileSrc}
                            alt={imageMobile?.alt ?? image?.alt ?? ""}
                            fill
                            priority
                            fetchPriority="high"
                            quality={IMAGE_QUALITY}
                            unoptimized={typeof mobileSrc === "string" && mobileSrc.endsWith(".svg")}
                            sizes="100vw"
                            className="hero__bg-img anim-initial"
                            style={{ "--anim-scale": 1.08 }}
                        />
                    </div>
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