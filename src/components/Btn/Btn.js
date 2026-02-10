import "./Btn.scss";
import Arrow from "@/components/icons/Arrow";

export default function Btn({ text = "Learn more", icon: Icon = Arrow, className = "" }) {
    return (
        <div className={`btn ${className}`}>
            <span className="btn__text">{text}</span>
            <Icon className="btn__icon" />
        </div>    
    );
}