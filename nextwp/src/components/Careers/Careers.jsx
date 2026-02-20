import "./Careers.scss";
import Image from "next/image";

export default function Careers(props) {
  return (
    <section className="careers">
      <div className="center-wrap center-wrap--small">
        <div className="careers__top">
          <div className="careers__statement">
            <h2 className="careers__heading simple-title">{props.title}</h2>
          </div>
          <div className="careers__content content" dangerouslySetInnerHTML={{ __html: typeof props.content === "string" ? props.content : "" }} />
        </div>
        <div className="careers__gallery white-header">
          {(props.gallery || []).map((item, i) => (
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
