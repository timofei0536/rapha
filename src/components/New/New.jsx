import "./New.scss";
import Image from "next/image";
import Link from "next/link";
import Btn from "@/components/ui/Btn/Btn";
import { ArrowLeft } from "@/components/ui/icons";
import NewShare from "./NewShare";
import Decor from "@/components/ui/icons/Decor";

export default function New({ title, date, image, content = "" }) {
    return (
        <section className="new center-wrap">
            <div className="center-wrap center-wrap--small">
                <div className="new__wrap">
                    <div className="new__left">
                        <time className="new__date">{date}</time>
                        <h1 className="new__title simple-title simple-title--large">
                            {typeof title === "string" && title.includes("\n")
                                ? title.split("\n").map((line, i, arr) => (
                                      <span key={i}>
                                          {line}
                                          {i < arr.length - 1 && <br />}
                                      </span>
                                  ))
                                : title}
                        </h1>
                        <div className="new__content">
                            <div className="new__body content" dangerouslySetInnerHTML={{ __html: content }} />
                            <div className="new__footer">
                                <NewShare />
                                <Link href="/news" className="new__back">
                                    <Btn text="Back to news" icon={ArrowLeft} iconPosition="left" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    {image && (
                        <div className="new__img img-wrap" style={{ aspectRatio: "1/1" }}>
                            <Image src={image.src} alt={image.alt ?? title} fill />
                        </div>
                    )}
                    <Decor className='decore decore--blue-l' />
                </div>
            </div>
        </section>
    );
}
