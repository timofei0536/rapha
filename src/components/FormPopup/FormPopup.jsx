"use client";

import { useEffect } from "react";
import "./FormPopup.scss";
import Plus from "@/components/ui/icons/Plus";

const MESSAGES = {
  apply: {
    first: "Your application has been submitted successfully.",
    second: "We will contact you soon!",
  },
  appointment: {
    first: "Your request has been submitted successfully.",
    second: "We will contact you soon!",
  },
};

export default function FormPopup({ open, onClose, name = "", variant = "appointment" }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const msg = MESSAGES[variant] ?? MESSAGES.appointment;
  const displayName = name.trim() || "name";

  return (
    <div
      className="form-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-popup-title"
    >
      <div className="form-popup__backdrop" onClick={onClose} aria-hidden />
      <div className="form-popup__box">
        <button
          type="button"
          className="form-popup__close"
          onClick={onClose}
          aria-label="Close"
        >
          <Plus className="form-popup__close-icon" />
        </button>
        <h2 id="form-popup-title" className="simple-title">
          Thank you, {displayName}
        </h2>
        <div className="content">
          <p>{msg.first}<br />{msg.second}</p>
        </div>
      </div>
    </div>
  );
}
