import "./AboutScreen.scss";
import Image from 'next/image';
import Decor from "@/components/ui/icons/Decor";

const DEFAULT_SUBTITLE = "Polyclinc";
const DEFAULT_TITLE = "The El-Rapha Polyclinic is a modern medical-surgical facility, equipped with high-end technical equipment and staffed by experienced practitioners with recognized expertise.";
const DEFAULT_CONTENT = "It was inaugurated on May 27, 2000 by His Excellency <b>El Hadj Omar BONGO ONDIMBA</b> and started its activities the same year. Our ambition is to provide you with a <b>welcoming facility</b> while ensuring <b>fast and high-quality care.</b>";
const DEFAULT_IMAGE = { src: "/images/about/about-screen.png", alt: "image" };

export default function AboutScreen({ subtitle = DEFAULT_SUBTITLE, title = DEFAULT_TITLE, content = DEFAULT_CONTENT, image = DEFAULT_IMAGE }) {
    return (
        <section className="about-screen white-header">
                <div className="about-screen__left">
                    <div className="about-screen__subtitle">{subtitle}</div>
                    <h1 className="about-screen__title simple-title">{title}</h1>
                    <div className="about-screen__content content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>

                <div className="about-screen__image img-wrap">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                  />
                </div>
                <Decor className='decore decore--white' />
        </section>
    );
}
