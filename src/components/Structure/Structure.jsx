import "./Structure.scss";
import "@/components/ui/Toogles/Toogles.scss";
import Btn from "@/components/ui/Btn/Btn";
import Plus from "@/components/ui/icons/Plus";
import Toogles from "@/components/ui/Toogles/Toogles";

export default function Structure(props) {
    const { title, tabs } = props;
    const tabList = props.tabs || [];
    return (
        <section className="structure">
            <Toogles />
            <div className="center-wrap center-wrap--small">
                <h2 className="structure__title simple-title">{title}</h2>
                <div className="structure__wrap toogles">
                    <div className="structure__nav">
                        {tabList.map((tab, index) => (
                            <div
                                key={index}
                                className={`toogles__title structure__btn-wrap${index === 0 ? ' toogles__title--active' : ''}`}
                                data-toogles={index}
                            >
                                <Btn
                                    text={tab.label}
                                    icon={Plus}
                                    className="btn--gray"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="structure__tabs">
                        {tabList.map((tab, index) => (
                            <div
                                key={index}
                                className={`toogles__item${index === 0 ? ' toogles__item--active' : ''}`}
                                data-toogles={index}
                            >
                                <div className="toogles__item-content">
                                    <div className="structure__tab content" dangerouslySetInnerHTML={{ __html: tab.content }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
