import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/ui/icons/Decor";

const DEFAULT_TITLE = "Cutting edge medicine in the heart of Africa";
const DEFAULT_FORM_TITLE = "Book an Appointment";
const DEFAULT_IMAGE = { src: "/images/hero-image.png", alt: "rapha-polyclinique" };

export default function Hero({ title = DEFAULT_TITLE, formTitle = DEFAULT_FORM_TITLE, image = DEFAULT_IMAGE }) {
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                <Image src={image.src} alt={image.alt} fill />
            </div>
            <Image src={image.src} alt={image.alt} className="hero__bg" fill />
            <div className="center-wrap">
                <h1 className="hero__title">{title}</h1>
                <div className="hero__form">
                    <span className="hero__form-title">{formTitle}</span>
                    <Form />    
                </div>
            </div>
            <Decor className='decore' />
        </section>    
    );
}