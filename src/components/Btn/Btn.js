import "./Btn.scss";
import Arrow from "@/components/icons/Arrow";

export default function Btn({ text = "Learn more", icon: Icon = Arrow, iconPosition = "right", className = "" }) {
    const isIconLeft = iconPosition === "left";
    return (
        <div className={`btn ${isIconLeft ? "btn--icon-left" : ""} ${className}`}>
            {isIconLeft && <Icon className="btn__icon" />}
            <span className="btn__text">{text}</span>
            {!isIconLeft && <Icon className="btn__icon" />}
        </div>
    );
}