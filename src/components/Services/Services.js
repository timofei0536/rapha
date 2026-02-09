import "./Services.scss";
import Image from "next/image";
import Icon1 from "@/components/icons/services/Icon1";
import Icon2 from "@/components/icons/services/Icon2";
import Icon3 from "@/components/icons/services/Icon3";
import Icon4 from "@/components/icons/services/Icon4";
import Icon5 from "@/components/icons/services/Icon5";
import Btn from "@/components/Btn/Btn";
import Send from "@/components/icons/Download";

export default function Services() {
    return (
        <section className="services">
            <div className="center-wrap">
                <div className="services__list">
                    <div className="services__item">
                        <h1>Our Services</h1>
                        <Image src="/images/services.png" alt="services-background" className="services__bg" width={588} height={450} />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon1 />
                        </div>
                        <h2 className="services__item-title">Emergencies</h2>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon2 />
                        </div>
                        <h2 className="services__item-title">Surgery & Operating room</h2>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance</p>
                        </div>
                        <Btn text="Learn more" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon3 />
                        </div>
                        <h2 className="services__item-title">Medical Imaging</h2>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon4 />
                        </div>
                        <h2 className="services__item-title">Analysis Laboratory</h2>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon5 />
                        </div>
                        <h2 className="services__item-title">Gynecology-Obstetrics</h2>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" />
                    </div>
                </div>
                <div className="services__btns">
                    <Btn text="Catalog" icon={Send} />
                    <Btn text="All Services"/>
                </div>
            </div>
        </section>    
    );
}