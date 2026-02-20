import "./Services.scss";
import Image from "next/image";
import Icon1 from "@/components/ui/icons/services/Icon1";
import Icon2 from "@/components/ui/icons/services/Icon2";
import Icon3 from "@/components/ui/icons/services/Icon3";
import Icon4 from "@/components/ui/icons/services/Icon4";
import Icon5 from "@/components/ui/icons/services/Icon5";
import Btn from "@/components/ui/Btn/Btn";
import Send from "@/components/ui/icons/Download";

const SERVICE_ICONS = [Icon1, Icon2, Icon3, Icon4, Icon5];

export default function Services(props) {
    const { title, image, services } = props;
    return (
        <section className="services">
            <div className="center-wrap">
                <div className="services__list">
                    <div className="services__item services__item--title">
                        <h2 className='simple-title'>{title}</h2>
                        <Image src={image?.src} alt={image?.alt} className="services__item-bg" width={588} height={450} />
                    </div>
                    {(services || []).map((item, i) => {
                        const Icon = SERVICE_ICONS[i];
                        const titleLines = item.title.split("\n");
                        return (
                            <div key={i} className="services__item">
                                <div className="services__item-icon">
                                    {Icon && <Icon />}
                                </div>
                                <h3 className="services__item-title simple-title">
                                    {titleLines.length > 1 ? titleLines.map((line, j) => <span key={j}>{line}{j < titleLines.length - 1 && <br />}</span>) : item.title}
                                </h3>
                                <div className="services__item-text content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                <Btn text="Learn more" className="btn--transparent btn--small" />
                            </div>
                        );
                    })}
                </div>
                <div className="services__btns">
                    <Btn
                        text="Catalog"
                        icon={Send}
                        className="btn--blue"
                        href="/cataloge.pdf"
                        download="cataloge.pdf"
                    />
                    <Btn text="All Services" className="btn--blue-l"/>
                </div>
            </div>
        </section>    
    );
}