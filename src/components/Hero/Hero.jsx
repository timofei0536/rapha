import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/ui/icons/Decor";

export default function Hero(props) {
    const { title, formTitle, image, imageMobile } = props;
    const mobileSrc = imageMobile?.src ?? image?.src;
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                <Image src={image?.src} alt={image?.alt} fill />
            </div>
            <picture className="hero__bg">
                <source media="(max-width: 1023px)" srcSet={mobileSrc} />
                <img src={image?.src} alt={image?.alt ?? ""} className="hero__bg-img" />
            </picture>
            <div className="center-wrap">
                <h1 className="hero__title simple-title simple-title--large">{title}</h1>
                <div className="hero__form">
                    <span className="hero__form-title">{formTitle}</span>
                    <Form />    
                </div>
            </div>
            <Decor className='decore' />
        </section>    
    );
}