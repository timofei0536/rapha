import "./Hero.scss";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="hero">
            <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="hero__bg" width={1260} height={1070} />
            <div className="center-wrap">
                <h1 className="hero__title">Cutting edge medicine in the heart of Africa</h1>
            </div>
        </section>    
    );
}