import "./News.scss";
import Image from "next/image";
import Link from 'next/link'
import Btn from "@/components/ui/Btn/Btn";


export default function news() {
    return (
        <section className="news">
            <div className="center-wrap center-wrap--small">
            <h2 className="simple-title simple-title--center news__title">News</h2>
            <div className="news__list">
                <div className="news__item">
                    <Image src="/images/news1.png" alt="news-image" className="news__item-img" width={500} height={400} />
                    <h3 className="news__item-title">Lorem ipsum dolor</h3>
                    <div className="news__item-text content">
                        <p>Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, </p>
                    </div>
                    <Link href="#" className='news__item-link link link-hover'>Read more</Link>
                </div>
                <div className="news__item">
                    <Image src="/images/news2.png" alt="news-image" className="news__item-img" width={500} height={400} />
                    <h3 className="news__item-title">Lorem ipsum dolor</h3>
                    <div className="news__item-text content">
                        <p>Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, </p>
                    </div>
                    <Link href="#" className='news__item-link link link-hover'>Read more</Link>
                </div>
                <div className="news__item">
                    <Image src="/images/news3.png" alt="news-image" className="news__item-img white-header" width={500} height={400} />
                    <h3 className="news__item-title">Lorem ipsum dolor</h3>
                    <div className="news__item-text content">
                        <p>Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, </p>
                    </div>
                    <Link href="#" className='news__item-link link link-hover'>Read more</Link>
                </div>
            </div>
            </div>
        </section>    
    );
}