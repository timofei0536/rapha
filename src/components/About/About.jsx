import "./About.scss";
import Image from 'next/image';

export default function About(props) {
    const { gm, title, items } = props;
    const titleLines = (title || "").split("\n");
    return (
        <section className="about">
            <div className="center-wrap center-wrap--small">
                
            <h2 className="simple-title about__title desktop--hide">
                    {titleLines.length > 1 ? titleLines.map((line, j) => <span key={j}>{line}{j < titleLines.length - 1 && <br />}</span>) : title}
            </h2>

            <div className="about__gm">
                <div className="img-wrap about__gm-img" style={{ aspectRatio: "1/1" }}>
                  {gm?.image?.src ? (
                  <Image
                    src={gm.image.src}
                    alt={gm?.image?.alt ?? ""}
                    fill
                    quality={95}
                  />
                  ) : null}
                </div>
                <div className="about__gm-title">{gm?.title}</div>
                <div className="about__gm-position">{gm?.position}</div>
            </div>
            <div className="about__content">
                <h2 className="simple-title about__title mobile--hide">
                    {titleLines.length > 1 ? titleLines.map((line, j) => <span key={j}>{line}{j < titleLines.length - 1 && <br />}</span>) : title}
                </h2>
                <div className="about__items">
                    {(items || []).map((item, i) => (
                        <div key={i} className={`about__item${i === 1 ? " about__item--hor" : ""}`}>
                            {item.layout === "image-content" ? (
                                <>
                                    {item.image?.src ? (
                                    <div className="img-parallax about__item-img">
                                        <div className="img-parallax__wrap">
                                            <Image
                                                src={item.image.src}
                                                alt={item.image.alt || ""}
                                                width={0}
                                                height={0}
                                                sizes="50vw"
                                                quality={95}
                                                className="img-auto"
                                            />
                                        </div>
                                    </div>
                                    ) : null}
                                    <div className="about__item-content content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                </>
                            ) : (
                                <>
                                    <div className="about__item-content content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    {item.image?.src ? (
                                    <div className="img-parallax about__item-img">
                                        <div className="img-parallax__wrap">
                                            <Image
                                                src={item.image.src}
                                                alt={item.image.alt || ""}
                                                width={0}
                                                height={0}
                                                sizes="50vw"
                                                quality={95}
                                                className="img-auto"
                                            />
                                        </div>
                                    </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </section>
    );
}
