import "./Infra.scss";
import Image from "next/image";
import Btn from "@/components/Btn/Btn";

export default function Infra() {
    return (
        <section className="infra">
            <h2 className="simple-title">Our Infrastructure</h2>
            <div className="infra__list">
                <div className="infra__item">
                    <h3 className="simple-title">24/7 Ambulance</h3>
                    <Btn text="Learn More"/>
                </div>
                <div className="infra__item">
                    <h3 className="simple-title">Food and Dietetics</h3>
                    <Btn text="Learn More"/>
                </div>
                <div className="infra__item">
                    <h3 className="simple-title">Special Nurses</h3>
                    <Btn text="Learn More"/>
                </div>
            </div>
        </section>    
    );
}