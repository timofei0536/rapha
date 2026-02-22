import "./News.scss";
import Image from "next/image";
import Link from 'next/link';
import Btn from "@/components/ui/Btn/Btn";

export default function News(props) {
    const { title, items } = props;
    return (
        <section className="news">
            <div className="center-wrap center-wrap--small">
            <h2 className="simple-title simple-title--center news__title">{title}</h2>
            <div className="news__list">
                {(items || []).map((item, i) => (
                    <div key={i} className="news__item">
                        {/* <Image src={item.image.src} alt={item.image.alt} className={i === 2 ? "news__item-img white-header" : "news__item-img"} width={500} height={400} /> */}
                        <div className="img-wrap" style={{ aspectRatio: "500/400" }}>
                          <Image
                            src={item.image.src} alt={item.image.alt} className={i === 2 ? "news__item-img white-header" : "news__item-img"}
                            fill
                          />
                        </div>
                        <h3 className="news__item-title">{item.title}</h3>
                        <div className="news__item-text content" dangerouslySetInnerHTML={{ __html: item.content }} />
                        <Link href="#" className='news__item-link link link-hover'>Read more</Link>
                    </div>
                ))}
            </div>
            <div className="news__more">
                <Btn text="More News" href="#" className="btn--blue-l" />
            </div>
            </div>
        </section>    
    );
}