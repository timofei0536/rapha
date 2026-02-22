import "./Infra.scss";
import Image from "next/image";
import Btn from "@/components/ui/Btn/Btn";

export default function Infra(props) {
    const { title, items } = props;
    return (
        <section className="infra">
            <div className="center-wrap center-wrap--small">
            <h2 className="infra__title simple-title simple-title--center">{title}</h2>
            <div className="infra__list">
                {(items || []).map((item, i) => (
                    <div key={i} className="infra__item">
                        <Image 
                            src={item.image.src} 
                            alt={item.image.alt} 
                            className="infra__item-img white-header"
                            fill
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