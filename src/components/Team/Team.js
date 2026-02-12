import "./Team.scss";
import Image from "next/image";
import Btn from "@/components/Btn/Btn";

export default function Team() {
    return (
        <section className="team">
            <div className="center-wrap">
                <div className="team__wrap">
                        <div className="team__left">
                            <h2 className="team__small-title simple-title">Our Medical Teams</h2>
                            <span className="team__title">Excellence in Every Discipline</span>
                            <div className="team__text content">
                                <p>Our hospital brings together leading experts across medicine, surgery, and diagnostics. With advanced training and a shared mission to raise healthcare standards in Africa, our teams set new benchmarks for patient care.</p>
                            </div>
                            <Btn text='Read More' className="btn--orange" />
                        </div>
                        <div className="team__gallery">
                            <div className="team__gallery-part team__gallery-part--left">
                                <Image 
                                    src="/images/team-gallery/team-gallery-2.png" 
                                    alt="Medical team member" 
                                    className="team__gallery-img"
                                    width={434}
                                    height={412}
                                />
                                <Image 
                                    src="/images/team-gallery/team-gallery-4.png" 
                                    alt="Medical team member" 
                                    className="team__gallery-img"
                                    width={434}
                                    height={536}
                                />
                                <Image 
                                    src="/images/team-gallery/team-gallery-3.png" 
                                    alt="Medical team member" 
                                    className="team__gallery-img"
                                    width={434}
                                    height={64}
                                />
                            </div>
                            <div className="team__gallery-part team__gallery-part--right">
                                <Image 
                                    src="/images/team-gallery/team-gallery-5.png" 
                                    alt="Medical team member" 
                                    className="team__gallery-img"
                                    width={434}
                                    height={224}
                                />
                                <Image 
                                    src="/images/team-gallery/team-gallery-1.png" 
                                    alt="Medical team members" 
                                    className="team__gallery-img"
                                    width={434}
                                    height={450}
                                />
                            </div>
                        </div>
                </div>
            </div>
        </section>    
    );
}