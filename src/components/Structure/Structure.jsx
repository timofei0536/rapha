import "./Structure.scss";
import "@/components/ui/Toogles/Toogles.scss";
import Btn from "@/components/ui/Btn/Btn";
import Plus from "@/components/ui/icons/Plus";
import Toogles from "@/components/ui/Toogles/Toogles";

const DEFAULT_TITLE = "The Structure";
const DEFAULT_TABS = [
    {
        label: "Ground Floor",
        content: `<ul>
<li>Endoscopy Unit</li>
<li>Outpatient consultation</li>
<li>Emergency Department</li>
<li>Main Hall</li>
<li>Internal Medicine and Dialysis Department</li>
<li>Cafeteria</li>
<li>Admissions Office</li>
<li>Box</li>
</ul>`,
    },
    {
        label: "First Floor",
        content: `<ul>
<li>Intensive Care Unit</li>
<li>Neonatal Unit</li>
<li>Recovery Room</li>
<li>Delivery room</li>
<li>Hospitalization Chambers Maternity</li>
<li>Conference room</li>
<li>Operating rooms</li>
<li>Obstetrics Unit</li>
<li>Visceral Unit</li>
<li>Orthopedic and Trauma Block</li>
<li>Otolaryngology and Ophthalmology Unit</li>
<li>Gynecology, Obstetrics and Maternity Services</li>
</ul>`,
    },
    {
        label: "Second Floor",
        content: `<ul>
<li>General Management (Administrative Offices)</li>
<li>Surgical inpatient rooms</li>
<li>Pediatric Department (Annex Building)</li>
<li>Conference room</li>
</ul>`,
    },
    {
        label: "Level R - I",
        content: `<ul>
<li>Medical imaging department
<ul>
<li>Ultrasound</li>
<li>X-ray</li>
<li>CT scan</li>
<li>MRI</li>
<li>Mammography</li>
</ul>
</li>
<li>Medical Analysis Laboratory
<ul>
<li>Bacteriology</li>
<li>Hematology</li>
<li>Biochemistry</li>
</ul>
</li>
<li>Pharmacy</li>
<li>Kitchen</li>
<li>Laundry</li>
</ul>`,
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
                        {tabs.map((tab, index) => (
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
