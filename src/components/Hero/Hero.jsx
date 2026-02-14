import "./Hero.scss";
import Image from "next/image";
import Form from "@/components/Form/Form";
import Decor from "@/components/icons/Decor";

export default function Hero() {
    return (
        <section className="hero white-header">
            <div className="hero__blur-wrap">
                <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="hero__bg hero__bg--blur" width={1260} height={1070} />
            </div>
            <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="hero__bg" width={1260} height={1070} />
            <div className="center-wrap">
                <h1 className="hero__title">Cutting edge medicine in the heart of Africa</h1>
                <div className="hero__form">
                    <span className="hero__form-title">Book an Appointment</span>
                    <Form />    
                </div>
            </div>
            <Decor className='hero__decor' />
            <Image
              src="/images/filename.png"
              alt="description"
              width={500}
              height={300}
              priority
            />
        </section>    
    );
}