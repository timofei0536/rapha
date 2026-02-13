import "./Structure.scss";
import Btn from "@/components/Btn/Btn";
import Plus from "@/components/icons/Plus";

export default function Structure() {
    return (
        <section className="structure">
            <div className="center-wrap center-wrap--small">
                <div className="h2 simple-title">The Structure</div>
                <div className="structure__wrap">
                    <div className="structure__nav">
                        <Btn text="Ground Floor" icon={Plus} className="btn--gray" />
                        <Btn text="First Floor" icon={Plus} className="btn--gray" />
                        <Btn text="Second Floor" icon={Plus} className="btn--gray" />
                        <Btn text="Level R - I" icon={Plus} className="btn--gray" />
                    </div>
                    <div className="structure__tabs">
                        <div className="structure__tab content">
                            
                            <ul>
                                <li>Endoscopy Unit</li>
                                <li>Outpatient consultation</li>
                                <li>Emergency Department</li>
                                <li>Main Hall</li>
                                <li>Internal Medicine and Dialysis Department</li>
                                <li>Cafeteria</li>
                                <li>Admissions Office</li>
                                <li>Box</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
