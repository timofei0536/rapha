import "./PageScreen.scss";
import Image from "next/image";
import Decor from "@/components/ui/icons/Decor";

function titleWithBreaks(title) {
    if (title == null || typeof title !== "string") return title;
    const normalized = title.replace(/\\n/g, "\n");
    const lines = normalized.split(/\r?\n/);
    if (lines.length <= 1) return title;
    return lines.map((line, i) => (
        <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
        </span>
    ));
}

export default function PageScreen({ className = "", title, image, actions }) {
    const useProps = title != null && image != null && image.src;
    return (
        <section className={`page-screen white-header ${className}`.trim()}>
            <div className="center-wrap">
                {useProps && (
                    <>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            className="page-screen__bg"
                            width={1920}
                            height={1070}
                        />
                        <h1 className="simple-title simple-title--large">{titleWithBreaks(title)}</h1>
                        {actions}
                        <Decor className="decore decore--white" />
                    </>
                )}
            </div>
        </section>
    );
}