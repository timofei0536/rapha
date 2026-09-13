"use client";

import "./Btn.scss";
import Arrow from "@/components/ui/icons/Arrow";
import { useGeneral } from "@/context/GeneralContext";

export default function Btn({ text, icon: Icon = Arrow, iconPosition = "right", className = "", href, target, download, type, disabled, "aria-label": ariaLabel }) {
    const { learn_more } = useGeneral();
    const label = text ?? learn_more ?? "Learn more";
    const isIconLeft = iconPosition === "left";
    const classNames = `btn ${isIconLeft ? "btn--icon-left" : ""} ${className}`.trim();
    const content = (
        <>
            {isIconLeft && <Icon className="btn__icon" aria-hidden />}
            <span className="btn__text">{label}</span>
            {!isIconLeft && <Icon className="btn__icon" aria-hidden />}
        </>
    );
    if (href) {
        return (
            <a href={href} className={classNames} download={download} aria-label={ariaLabel} target={target || undefined} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
                {content}
            </a>
        );
    }
    if (type === "submit") {
        return (
            <button type="submit" className={classNames} disabled={disabled}>
                {content}
            </button>
        );
    }
    return <div className={classNames}>{content}</div>;
}