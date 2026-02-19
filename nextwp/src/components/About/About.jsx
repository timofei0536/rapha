import "./About.scss";
import Image from 'next/image';

const DEFAULT_GM = {
    image: { src: "/images/about/manager.png", alt: "Curtis Andjoua Opra" },
    title: "Curtis Andjoua Opra",
    position: "General Manager",
};
const DEFAULT_SECTION_TITLE = "The word of\nGeneral manager";
const DEFAULT_ITEMS = [
    { content: "<p><b>Welcome</b> to the <b>EL-RAPHA Polyclinic</b>, where the Director, the medical team, and all the staff are pleased to welcome you. While thanking you for your trust, they assure you of their dedication to providing you with the <b>best possible care</b>.</p>", image: { src: "/images/about/about1.png", alt: "image" }, layout: "content-image" },
    { content: "<p>Our mission has always been to ensure <b>quality</b> <b>and safe care</b> in various fields of general and specialized medicine, respecting our founding values: <b>a welcoming and friendly atmosphere</b>, <b>respect and compassion</b>, <b>sharing and fairness</b>. The primary purpose of any healthcare facility, whether public or private, is, and must remain, the quality of care and the safety of patients.</p>", image: { src: "/images/about/about2.png", alt: "image" }, layout: "content-image" },
    { content: "<p>The EL-RAPHA Polyclinic is constantly evolving to provide its patients with the <b>highest quality of care and safety</b> tailored to their needs and expectations. The Polyclinic's staff, regardless of their role, contributes to this <b>pursuit of excellence</b>, guiding their work to provide you with the best possible care and make your stay as comfortable as possible.</p><p><b>We thank you for your trust over the past 10 years; it is an honor and a responsibility we all share.</b></p>", image: { src: "/images/about/about3.png", alt: "image" }, layout: "image-content" },
];

export default function About({ gm = DEFAULT_GM, sectionTitle = DEFAULT_SECTION_TITLE, items = DEFAULT_ITEMS }) {
    const titleLines = sectionTitle.split("\n");
    return (
        <section className="about">
            <div className="center-wrap center-wrap--small">
            <div className="about__gm">
                <div className="img-wrap about__gm-img" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src={gm.image.src}
                    alt={gm.image.alt}
                    fill
                  />
                </div>
                <div className="about__gm-title">{gm.title}</div>
                <div className="about__gm-position">{gm.position}</div>
            </div>
            <div className="about__content">
                <h2 className="simple-title about__title">
                    {titleLines.length > 1 ? titleLines.map((line, j) => <span key={j}>{line}{j < titleLines.length - 1 && <br />}</span>) : sectionTitle}
                </h2>
                <div className="about__items">
                    {items.map((item, i) => (
                        <div key={i} className={`about__item${i === 1 ? " about__item--hor" : ""}`}>
                            {item.layout === "image-content" ? (
                                <>
                                    <Image
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        width={0}
                                        height={0}
                                        sizes="50vw"
                                        className="img-auto"
                                    />
                                    <div className="about__item-content content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                </>
                            ) : (
                                <>
                                    <div className="about__item-content content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    <Image
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        width={0}
                                        height={0}
                                        sizes="50vw"
                                        className="img-auto"
                                    />
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
