import "./AboutScreen.scss";
import Image from 'next/image';
import Decor from "@/components/ui/icons/Decor";

export default function AboutScreen(props) {
    const { subtitle, title, content, image } = props;
    return (
        <section className="about-screen white-header">
                <div className="about-screen__left">
                    <div className="about-screen__subtitle">{subtitle}</div>
                    <h1 className="about-screen__title simple-title">{title}</h1>
                    <div className="about-screen__content content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>

                <div className="about-screen__image img-wrap">
                  <Image
                    src={image?.src}
                    alt={image?.alt}
                    fill
                  />
                </div>
                <Decor className='decore decore--white' />
        </section>
    );
}
