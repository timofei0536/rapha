import "./NewsScreen.scss";
import Image from "next/image";
import Link from "next/link";
import Decor from "@/components/icons/Decor";

export default function NewsScreen() {
    return (
        <section className="news-screen">
            <div className="center-wrap center-wrap--small">
            <div className="news-screen__wrap">
                <h1 className="news-screen__title simple-title simple-title--large">News</h1>
                <div className="news-screen__right">
                    <div className="news-screen__content">
                        <span className="news-screen__content-subtitle">Featured News</span>
                        <h2 className="news-screen__content-title simple-title">
                            Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
                        </h2>
                        <p className="news-screen__content-text content">
                            Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
                        </p>
                        <Link href="#" className="news-screen__link link">
                            Read more
                        </Link>
                    </div>
                    <div className="news-screen__img img-wrap" style={{ aspectRatio: "1/1" }}>
                            <Image
                            src="/images/news-page.png"
                            alt="image"
                            fill
                            />
                        </div>
                </div>
            </div>
            <div className="news-screen__decor" aria-hidden="true" />
            </div>
            <Decor className='news-screen__decor' />
        </section>
    );
}
