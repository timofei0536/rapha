import "./Team.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";

const DEFAULT_TITLE_SMALL = "Our Medical Teams";
const DEFAULT_TITLE = "Excellence in Every Discipline";
const DEFAULT_TEXT = "Our hospital brings together leading experts across medicine, surgery, and diagnostics. With advanced training and a shared mission to raise healthcare standards in Africa, our teams set new benchmarks for patient care.";
const DEFAULT_GALLERY = {
    left: [
        { image: { src: "/images/team-gallery/team-gallery-2.png", alt: "Medical team member" }, width: 434, height: 412 },
        { image: { src: "/images/team-gallery/team-gallery-4.png", alt: "Medical team member" }, width: 434, height: 536 },
        { image: { src: "/images/team-gallery/team-gallery-3.png", alt: "Medical team member" }, width: 434, height: 64 },
    ],
    right: [
        { image: { src: "/images/team-gallery/team-gallery-5.png", alt: "Medical team member" }, width: 434, height: 224 },
        { image: { src: "/images/team-gallery/team-gallery-1.png", alt: "Medical team members" }, width: 434, height: 450 },
    ],
};

export default function Team({ titleSmall = DEFAULT_TITLE_SMALL, title = DEFAULT_TITLE, text = DEFAULT_TEXT, gallery = DEFAULT_GALLERY }) {
    return (
        <section className="team">
            <div className="center-wrap">
                <div className="team__wrap white-header">
                        <div className="team__left">
                            <h2 className="team__small-title simple-title">{titleSmall}</h2>
                            <span className="team__title">{title}</span>
                            <div className="team__text content">
                                <p>{text}</p>
                            </div>
                            <Btn text='Read More' className="btn--orange" />
                        </div>
                        <div className="team__gallery">
                            <div className="team__gallery-part team__gallery-part--left">
                                {(gallery.left ?? []).map((item, i) => (
                                    <Image
                                        key={i}
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        className="team__gallery-img"
                                        width={item.width ?? 434}
                                        height={item.height ?? 412}
                                    />
                                ))}
                            </div>
                            <div className="team__gallery-part team__gallery-part--right">
                                {(gallery.right ?? []).map((item, i) => (
                                    <Image
                                        key={i}
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        className="team__gallery-img"
                                        width={item.width ?? 434}
                                        height={item.height ?? 224}
                                    />
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </section>    
    );
}