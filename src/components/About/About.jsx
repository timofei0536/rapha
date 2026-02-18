import "./About.scss";
import Image from 'next/image';

export default function About() {
    return (
        <section className="about">
            <div className="center-wrap center-wrap--small">
            <div className="about__gm">
                <div className="img-wrap about__gm-img" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src="/images/about/manager.png"
                    alt="Curtis Andjoua Opra"
                    fill
                  />
                </div>
                <div className="about__gm-title">Curtis Andjoua Opra</div>
                <div className="about__gm-position">General Manager</div>
            </div>
            <div className="about__content">
                <h2 className="simple-title about__title">The word of<br/> General manager</h2>
                <div className="about__items">
                    <div className="about__item">
                        <div className="about__item-content content">
                            <p><b>Welcome</b> to the <b>EL-RAPHA Polyclinic</b>, where the Director, the medical team, and all the staff are pleased to welcome you. While thanking you for your trust, they assure you of their dedication to providing you with the <b>best possible care</b>.</p>
                        </div>
                          <Image
                            src="/images/about/about1.png"
                            alt="image"
                            width={0}
                            height={0}
                            sizes="50vw"
                            className="img-auto"
                          />
                    </div>
                    <div className="about__item about__item--hor">
                        <div className="about__item-content content">
                        <p>Our mission has always been to ensure <b>quality</b> <b>and safe care</b> in various fields of general and specialized medicine, respecting our founding values: <b>a welcoming and friendly atmosphere</b>, <b>respect and compassion</b>, <b>sharing and fairness</b>. The primary purpose of any healthcare facility, whether public or private, is, and must remain, the quality of care and the safety of patients.</p>
                        </div>
                          <Image
                            src="/images/about/about2.png"
                            alt="image"
                            width={0}
                            height={0}
                            sizes="50vw"
                            className="img-auto"
                          />
                    </div>
                    <div className="about__item">
                    <Image
                            src="/images/about/about3.png"
                            alt="image"
                            width={0}
                            height={0}
                            sizes="50vw"
                            className="img-auto"
                          />
                        <div className="about__item-content content">
                        <p>The EL-RAPHA Polyclinic is constantly evolving to provide its patients with the <b>highest quality of care and safety</b> tailored to their needs and expectations. The Polyclinic's staff, regardless of their role, contributes to this <b>pursuit of excellence</b>, guiding their work to provide you with the best possible care and make your stay as comfortable as possible.</p>
                        <p><b>We thank you for your trust over the past 10 years; it is an honor and a responsibility we all share.</b></p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}
