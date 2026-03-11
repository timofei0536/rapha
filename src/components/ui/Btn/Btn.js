"use client";

import "./Btn.scss";
import Arrow from "@/components/ui/icons/Arrow";
import { useGeneral } from "@/context/GeneralContext";

export default function Btn({ text, icon: Icon = Arrow, iconPosition = "right", className = "", href, download, type }) {
    const { learn_more } = useGeneral();
    const label = text ?? learn_more ?? "Learn more";
    const isIconLeft = iconPosition === "left";
    const classNames = `btn ${isIconLeft ? "btn--icon-left" : ""} ${className}`.trim();
    const content = (
        <>
            {isIconLeft && <Icon className="btn__icon" />}
            <span className="btn__text">{label}</span>
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
    if (type === "submit") {
        return (
            <button type="submit" className={classNames}>
                {content}
            </button>
        );
    }
    return <div className={classNames}>{content}</div>;
}