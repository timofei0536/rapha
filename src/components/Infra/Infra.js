import "./Infra.scss";
import Image from "next/image";
import Link from "next/link";
import Btn from "@/components/ui/Btn/Btn";

function titleToSlug(title) {
  if (!title) return "";
  return String(title)
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function Infra(props) {
    const { title, items } = props;
    return (
        <section className="infra">
            <div className="center-wrap center-wrap--small">
            <h2 className="infra__title simple-title simple-title--center">{title}</h2>
            <div className="infra__list">
                {(items || []).map((item, i) => {
                    const slug = item.slug || titleToSlug(item.title) || `infra-${i + 1}`;
                    const href = item.link?.href || `/news/${slug}`;
                    const linkText = item.link?.text || "Learn More";
                    return (
                    <div key={i} className="infra__item">
                        <Link href={href} className="infra__item-img-wrap">
                            <Image 
                                src={item.image?.src} 
                                alt={item.image?.alt ?? ""} 
                                className="infra__item-img white-header"
                                fill
                            />
                        </Link>
                        <h3 className="simple-title infra__item-title">{item.title}</h3>
                        <Btn text={linkText} href={href} className='btn--white btn--small' />
                    </div>
                );
                })}
            </div>
            </div>
        </section>    
    );
}