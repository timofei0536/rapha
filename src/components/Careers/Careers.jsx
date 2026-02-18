import "./Careers.scss";
import Image from "next/image";

const DEFAULT_HEADING = "At El-Rapha Hospital, we're dedicated to providing compassionate, high-quality healthcare to our community and beyond.";
const DEFAULT_CONTENT = `<p>Our team is made up of passionate professionals, doctors, nurses, technicians, and support staff, all working together to improve lives every day.</p>
<p>We believe in continuous learning, teamwork, and respect for every individual. Whether you're starting your medical career or bringing years of experience, you'll find an environment that values your growth and your contribution.</p>
<p>Join us in shaping a healthier future for Gabon and the region.</p>`;
const DEFAULT_GALLERY = [
  { image: { src: "/images/careers1.png", alt: "Medical staff in laboratory" } },
  { image: { src: "/images/careers2.png", alt: "Healthcare professional with child patient" } },
  { image: { src: "/images/careers3.png", alt: "El-Rapha Hospital team" } },
];

export default function Careers({ heading = DEFAULT_HEADING, content = DEFAULT_CONTENT, gallery = DEFAULT_GALLERY }) {
  return (
    <section className="careers">
      <div className="center-wrap center-wrap--small">
        <div className="careers__top">
          <div className="careers__statement">
            <h2 className="careers__heading simple-title">{heading}</h2>
          </div>
          <div className="careers__content content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="careers__gallery white-header">
          {gallery.map((item, i) => (
            <Image
              key={i}
              src={item.image.src}
              alt={item.image.alt}
              className="careers__gallery-img"
              width={434}
              height={320}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
