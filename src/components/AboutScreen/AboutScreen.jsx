import "./AboutScreen.scss";
import Image from 'next/image';
import Decor from "@/components/ui/icons/Decor";
export default function AboutScreen() {
    return (
        <section className="about-screen white-header">
                <div className="about-screen__left">
                    <div className="about-screen__subtitle">Polyclinc</div>
                    <h1 className="about-screen__title simple-title">The El-Rapha Polyclinic is a modern medical-surgical facility, equipped with high-end technical equipment and staffed by experienced practitioners with recognized expertise.</h1>
                    <div className="about-screen__content content">It was inaugurated on May 27, 2000 by His Excellency <b>El Hadj Omar BONGO ONDIMBA</b> and started its activities the same year. Our ambition is to provide you with a <b>welcoming facility</b> while ensuring <b>fast and high-quality care.</b></div>
                </div>

                <div className="about-screen__image img-wrap">
                  <Image
                    src="/images/about/about-screen.png"
                    alt="image"
                    fill
                  />
                </div>
                <Decor className='decore decore--white' />
        </section>
    );
}
