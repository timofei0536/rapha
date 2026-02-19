import "./News.scss";
import Image from "next/image";
import Link from 'next/link';

const DEFAULT_TITLE = "News";
const DEFAULT_ITEMS = [
    { image: { src: "/images/news1.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { image: { src: "/images/news2.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { image: { src: "/images/news3.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
];

export default function News({ title = DEFAULT_TITLE, items = DEFAULT_ITEMS }) {
    return (
        <section className="news">
            <div className="center-wrap center-wrap--small">
            <h2 className="simple-title simple-title--center news__title">{title}</h2>
            <div className="news__list">
                {items.map((item, i) => (
                    <div key={i} className="news__item">
                        <Image src={item.image.src} alt={item.image.alt} className={i === 2 ? "news__item-img white-header" : "news__item-img"} width={500} height={400} />
                        <h3 className="news__item-title">{item.title}</h3>
                        <div className="news__item-text content">
                            <p>{item.content}</p>
                        </div>
                        <Link href="#" className='news__item-link link link-hover'>Read more</Link>
                    </div>
                ))}
            </div>
            </div>
        </section>    
    );
}