import "./Careers.scss";
import Image from "next/image";

export default function Careers() {
  return (
    <section className="careers">
      <div className="center-wrap center-wrap--small">
        <div className="careers__top">
          <div className="careers__statement">
            <h2 className="careers__heading simple-title">
              At El-Rapha Hospital, we&apos;re dedicated to providing compassionate, high-quality healthcare to our community and beyond.
            </h2>
          </div>
          <div className="careers__content content">
            <p>
              Our team is made up of passionate professionals, doctors, nurses, technicians, and support staff, all working together to improve lives every day.
            </p>
            <p>
              We believe in continuous learning, teamwork, and respect for every individual. Whether you&apos;re starting your medical career or bringing years of experience, you&apos;ll find an environment that values your growth and your contribution.
            </p>
            <p>
              Join us in shaping a healthier future for Gabon and the region.
            </p>
          </div>
        </div>
        <div className="careers__gallery white-header">
            <Image
              src="/images/careers1.png"
              alt="Medical staff in laboratory"
              className="careers__gallery-img"
              width={434}
              height={320}
            />
            <Image
              src="/images/careers2.png"
              alt="Healthcare professional with child patient"
              className="careers__gallery-img"
              width={434}
              height={320}
            />
            <Image
              src="/images/careers3.png"
              alt="El-Rapha Hospital team"
              className="careers__gallery-img"
              width={434}
              height={320}
            />
        </div>
      </div>
    </section>
  );
}
