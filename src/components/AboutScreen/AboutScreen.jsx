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
                    <div className="about-screen__content content" dangerouslySetInnerHTML={{ __html: typeof content === "string" ? content : "" }} />
                </div>

                <div className="about-screen__image img-wrap">
                  {image?.src ? (
                  <div className="img-parallax img-parallax--fill">
                    <div className="img-parallax__wrap">
                      <Image
                        src={image.src}
                        alt={image?.alt ?? ""}
                        fill
                        quality={95}
                      />
                    </div>
                  </div>
                  ) : null}
                  <Decor className='decore decore--white desktop--hide' />
                </div>
                <Decor className='decore decore--white mobile--hide' />
        </section>
    );
}
