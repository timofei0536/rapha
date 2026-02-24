import "./News.scss";
import Image from "next/image";
import Link from 'next/link';
import Btn from "@/components/ui/Btn/Btn";

function titleToSlug(title) {
  if (!title) return "";
  return String(title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const DEFAULT_NEWS_IMAGE = { src: "/images/news-page.png", alt: "" };

export default function News(props) {
    const { title, items, hideTitle, hideMoreButton, featured } = props;
    const isFeaturedMobile = featured && !hideMoreButton;
    const listItems = isFeaturedMobile
        ? [featured, ...(items || []).filter((i) => i.slug !== featured?.slug).slice(0, 2)]
        : (items || []);
    return (
        <section className={`news${hideMoreButton ? " news--full-list" : ""}${isFeaturedMobile ? " news--featured-mobile" : ""}`}>
            <div className="center-wrap center-wrap--small">
            {!hideTitle && <h2 className="simple-title simple-title--center news__title">{title}</h2>}
            <div className="news__list">
                {listItems.map((item, i) => {
                    const slug = item.slug || titleToSlug(item.title) || `news-${i + 1}`;
                    const href = `/news/${slug}`;
                    const image = item.image && typeof item.image === "object"
                      ? { src: item.image.src || DEFAULT_NEWS_IMAGE.src, alt: item.image.alt ?? "" }
                      : DEFAULT_NEWS_IMAGE;
                    const isFeatured = isFeaturedMobile && i === 0;
                    return (
                    <div key={i} className={`news__item${isFeatured ? " news__item--featured" : ""}`}>
                        <Link href={href} className="img-wrap" style={{ aspectRatio: "500/400" }}>
                          <Image
                            src={image.src} alt={image.alt} className={i === 2 ? "news__item-img white-header" : "news__item-img"}
                            fill
                          />
                        </Link>
                        <h3 className="news__item-title">{item.title}</h3>
                        <div className="news__item-text content" dangerouslySetInnerHTML={{ __html: item.preview ?? item.content ?? "" }} />
                        <Link href={href} className='news__item-link link link-hover'>Read more</Link>
                    </div>
                    );
                })}
            </div>
            {!hideMoreButton && (
            <div className="news__more">
                <Btn text="More News" href="/news" className="btn--blue-l" />
            </div>
            )}
            </div>
        </section>    
    );
}