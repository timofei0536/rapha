import "./Structure.scss";
import "@/components/ui/Toogles/Toogles.scss";
import Btn from "@/components/ui/Btn/Btn";
import Plus from "@/components/ui/icons/Plus";
import Toogles from "@/components/ui/Toogles/Toogles";

const DEFAULT_TITLE = "The Structure";
const DEFAULT_TABS = [
    {
        id: "0",
        label: "Ground Floor",
        list: [
            "Endoscopy Unit",
            "Outpatient consultation",
            "Emergency Department",
            "Main Hall",
            "Internal Medicine and Dialysis Department",
            "Cafeteria",
            "Admissions Office",
            "Box",
            "Emergency Department",
            "Main Hall",
            "Internal Medicine and Dialysis Department",
            "Cafeteria",
            "Admissions Office",
            "Box",
            "Emergency Department",
            "Main Hall",
            "Internal Medicine and Dialysis Department",
            "Cafeteria",
            "Admissions Office",
            "Box",
            "Emergency Department",
            "Main Hall",
            "Internal Medicine and Dialysis Department",
            "Cafeteria",
            "Admissions Office",
            "Box",
        ],
    },
    {
        id: "1",
        label: "First Floor",
        list: [
            "Operating Theatres",
            "Recovery Rooms",
            "Intensive Care Unit",
            "Consultation Rooms",
        ],
    },
    {
        id: "2",
        label: "Second Floor",
        list: [
            "Wards",
            "Nursing Stations",
            "Day Care",
        ],
    },
    {
        id: "3",
        label: "Level R - I",
        list: [
            "Radiology",
            "Laboratory",
            "Pharmacy",
        ],
    },
];

export default function Structure({ title = DEFAULT_TITLE, tabs = DEFAULT_TABS }) {
    return (
        <section className="structure">
            <Toogles />
            <div className="center-wrap center-wrap--small">
                <h2 className="structure__title simple-title">{title}</h2>
                <div className="structure__wrap toogles">
                    <div className="structure__nav">
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`toogles__title structure__btn-wrap${index === 0 ? ' toogles__title--active' : ''}`}
                                data-toogles={tab.id}
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
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`toogles__item${index === 0 ? ' toogles__item--active' : ''}`}
                                data-toogles={tab.id}
                            >
                                <div className="toogles__item-content">
                                    <div className="structure__tab content">
                                        <ul>
                                            {tab.list.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
