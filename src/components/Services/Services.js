import "./Services.scss";
import Image from "next/image";
import Icon1 from "@/components/ui/icons/services/Icon1";
import Icon2 from "@/components/ui/icons/services/Icon2";
import Icon3 from "@/components/ui/icons/services/Icon3";
import Icon4 from "@/components/ui/icons/services/Icon4";
import Icon5 from "@/components/ui/icons/services/Icon5";
import Btn from "@/components/ui/Btn/Btn";
import Send from "@/components/ui/icons/Download";

export default function Services() {
    return (
        <section className="services">
            <div className="center-wrap">
                <div className="services__list">
                    <div className="services__item services__item--title">
                        <h2 className='simple-title'>Our Services</h2>
                        <Image src="/images/services.png" alt="services-background" className="services__item-bg" width={588} height={450} />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon1 />
                        </div>
                        <h3 className="services__item-title simple-title">Emergencies</h3>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" className="btn--transparent btn--small" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon2 />
                        </div>
                        <h3 className="services__item-title simple-title">Surgery &<br/> Operating room</h3>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance</p>
                        </div>
                        <Btn text="Learn more" className="btn--transparent btn--small" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon3 />
                        </div>
                        <h3 className="services__item-title simple-title">Medical Imaging</h3>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" className="btn--transparent btn--small" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon4 />
                        </div>
                        <h3 className="services__item-title simple-title">Analysis Laboratory</h3>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" className="btn--transparent btn--small" />
                    </div>
                    <div className="services__item">
                        <div className="services__item-icon">
                            <Icon5 />
                        </div>
                        <h3 className="services__item-title simple-title">Gynecology-Obstetrics</h3>
                        <div className="services__item-text content">
                            <p>Serving patients and the establishment's medical and care teams 24/7, the medical biology analysis laboratory is also open to any external patient for the performance of analyses prescribed by their attending physician.</p>
                        </div>
                        <Btn text="Learn more" className="btn--transparent btn--small" />
                    </div>
                </div>
                <div className="services__btns">
                    <a
                        href="https://el-raphaga.com/Moncatalogue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--blue"
                        download="Livret-d-accueil.pdf"
                    >
                        <span className="btn__text">Catalog</span>
                        <Send className="btn__icon" />
                    </a>
                    <Btn text="All Services" className="btn--blue-l"/>
                </div>
            </div>
        </section>    
    );
}