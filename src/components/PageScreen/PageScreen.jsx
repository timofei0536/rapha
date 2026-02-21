import "./PageScreen.scss";
import Image from "next/image";
import Decor from "@/components/ui/icons/Decor";

export default function PageScreen({ children, className = "", title, image }) {
    const useProps = title != null && image != null && image.src;
    return (
        <section className={`page-screen white-header ${className}`.trim()}>
            <div className="center-wrap">
                {useProps ? (
                    <>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            className="page-screen__bg"
                            width={1920}
                            height={1070}
                        />
                        <h1 className="simple-title simple-title--large">{title}</h1>
                        <Decor className="decore decore--white" />
                    </>
                ) : (
                    children
                )}
            </div>
        </section>
    );
}