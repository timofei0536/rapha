import "./Infra.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";

const DEFAULT_TITLE = "Our Infrastructure";
const DEFAULT_ITEMS = [
    { image: { src: "/images/infra1.png", alt: "24/7 Ambulance" }, title: "24/7 Ambulance" },
    { image: { src: "/images/infra2.png", alt: "Food and Dietetics" }, title: "Food and Dietetics" },
    { image: { src: "/images/infra3.png", alt: "Special Nurses" }, title: "Special Nurses" },
];

export default function Infra({ title = DEFAULT_TITLE, items = DEFAULT_ITEMS }) {
    return (
        <section className="infra">
            <div className="center-wrap center-wrap--small">
            <h2 className="infra__title simple-title simple-title--center">{title}</h2>
            <div className="infra__list">
                {items.map((item, i) => (
                    <div key={i} className="infra__item">
                        <Image 
                            src={item.image.src} 
                            alt={item.image.alt} 
                            className="infra__item-img white-header"
                            width={500}
                            height={450}
                        />
                        <h3 className="simple-title infra__item-title">{item.title}</h3>
                        <Btn text="Learn More" className='btn--white btn--small' />
                    </div>
                ))}
            </div>
            </div>
        </section>    
    );
}