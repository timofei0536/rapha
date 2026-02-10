import "./Infra.scss";
import Image from "next/image";
import Btn from "@/components/Btn/Btn";

export default function Infra() {
    return (
        <section className="infra">
            <div className="center-wrap center-wrap--small">
            <h2 className="infra__title simple-title simple-title--center">Our Infrastructure</h2>
            <div className="infra__list">
                <div className="infra__item">
                    <Image 
                        src="/images/infra1.png" 
                        alt="24/7 Ambulance" 
                        className="infra__item-img"
                        width={500}
                        height={450}
                            />
                    <h3 className="simple-title infra__item-title">24/7 Ambulance</h3>
                    <Btn text="Learn More" className='btn--white' />
                </div>
                <div className="infra__item">
                    <Image 
                        src="/images/infra2.png" 
                        alt="Food and Dietetics" 
                        className="infra__item-img"
                        width={500}
                        height={450}
                            />
                    <h3 className="simple-title infra__item-title">Food and Dietetics</h3>
                    <Btn text="Learn More" className='btn--white' />
                </div>
                <div className="infra__item">
                    <Image 
                        src="/images/infra3.png" 
                        alt="Special Nurses" 
                        className="infra__item-img"
                        width={500}
                        height={450}
                            />
                    <h3 className="simple-title infra__item-title">Special Nurses</h3>
                    <Btn text="Learn More" className='btn--white' />
                </div>
            </div>
            </div>
        </section>    
    );
}