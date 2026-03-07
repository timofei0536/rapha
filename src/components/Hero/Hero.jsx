"use client";

import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/ui/icons/Decor";
import { getLowResImageSrc } from "@/lib/image-utils";
import { useState } from "react";

export default function Hero(props) {
    const { title, formTitle, image, imageMobile } = props;
    const mobileSrc = imageMobile?.src ?? image?.src;
    const [blurSrc, setBlurSrc] = useState(() => getLowResImageSrc(image?.src));
    const onBlurError = () => {
        if (image?.src && blurSrc !== image.src) setBlurSrc(image.src);
    };
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                <Image src={blurSrc} alt={image?.alt ?? ""} fill onError={onBlurError} />
            </div>
            <picture className="hero__bg">
                <source media="(max-width: 1023px)" srcSet={mobileSrc} />
                <img src={image?.src} alt={image?.alt ?? ""} className="hero__bg-img" data-anim-scale="1.08" />
            </picture>
            <div className="center-wrap">
                <h1 className="hero__title simple-title simple-title--large" data-anim-opacity="0">{title}</h1>
                <div className="hero__form">
                    <span className="hero__form-title" data-anim-opacity="0" data-anim-y="40">{formTitle}</span>
                    <Form dataAnimOpacity="0" dataAnimY="40" />
                </div>
            </div>
            <Decor className='decore' />
        </section>    
    );
}