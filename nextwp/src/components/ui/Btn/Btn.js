import "./Btn.scss";
import Arrow from "@/components/ui/icons/Arrow";

export default function Btn({ text = "Learn more", icon: Icon = Arrow, iconPosition = "right", className = "", href, download }) {
    const isIconLeft = iconPosition === "left";
    const classNames = `btn ${isIconLeft ? "btn--icon-left" : ""} ${className}`.trim();
    const content = (
        <>
            {isIconLeft && <Icon className="btn__icon" />}
            <span className="btn__text">{text}</span>
            {!isIconLeft && <Icon className="btn__icon" />}
        </>
    );
    if (href) {
        return (
            <a href={href} className={classNames} download={download}>
                {content}
            </a>
        );
    }
    return <div className={classNames}>{content}</div>;
}