"use client";

import { useState, useRef } from "react";
import "./Form.scss";
import Send from "@/components/ui/icons/Send";
import Upload from "@/components/ui/icons/Upload";
import Select from "@/components/ui/Select/Select";
import FormPopup from "@/components/FormPopup/FormPopup";
import Btn from "@/components/ui/Btn/Btn";
import { ServiceDefaults } from "@/components/Service/defaults";

const SERVICE_OPTIONS = [
  ...(ServiceDefaults.services || []).map((s) => ({ value: s.slug, label: s.title })),
  { value: "other", label: "Other" },
];

const PRACTITIONER_OPTIONS = [
  { value: "any", label: "Any available" },
  { value: "dr-mbenda", label: "Dr. Mbenda" },
  { value: "dr-okou", label: "Dr. Okou" },
  { value: "dr-ngoma", label: "Dr. Ngoma" },
];

const INSURANCE_OPTIONS = [
  { value: "none", label: "No insurance" },
  { value: "assurance-sante", label: "Assurance Santé" },
  { value: "axa", label: "AXA" },
  { value: "saham", label: "Saham" },
];

export default function Form({
  variant = "appointment",
  submitText = "Submit",
  submitIcon: SubmitIcon = Send,
  roleOptions = [],
}) {
  const [cvLabel, setCvLabel] = useState("Upload CV");
  const [coverLabel, setCoverLabel] = useState("Upload Cover Letter");
  const [showPopup, setShowPopup] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const dateInputRef = useRef(null);
  const formRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  const handleDateWrapClick = (e) => {
    if (e.target.tagName === "INPUT") return;
    e.preventDefault();
    dateInputRef.current?.focus();
    dateInputRef.current?.showPicker?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = form.elements?.name?.value?.trim() || "";
    setSubmittedName(name);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  if (variant === "apply") {
    return (
      <>
      <form ref={formRef} className="form form--apply" onSubmit={handleSubmit}>
        <div className="form__inputs">
          <input
            className="form__input"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            aria-label="Name"
            required
          />
          <Select
            name="role"
            placeholder="Role"
            className="form__input form__input--select"
            options={roleOptions}
            required
          />
          <input
            className="form__input"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            aria-label="Email"
            required
          />
          <input
            className="form__input"
            type="tel"
            name="number"
            placeholder="Number"
            autoComplete="tel"
            aria-label="Number"
            required
          />
          <div
            className="form__input form__input--date-wrap"
            onClick={handleDateWrapClick}
          >
            <input
              ref={dateInputRef}
              type="date"
              name="date"
              aria-label="Date"
              required
              min={today}
              className="form__input-date"
            />
          </div>
          <div className="form__sep"></div>
          <label className="form__upload">
            <span className="form__upload-text">{cvLabel}</span>
            <Upload className="form__upload-icon" />
            <input
              type="file"
              name="cv"
              className="form__file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setCvLabel(e.target.files?.[0]?.name ?? "Upload CV")}
            />
          </label>
          <label className="form__upload">
            <span className="form__upload-text">{coverLabel}</span>
            <Upload className="form__upload-icon" />
            <input
              type="file"
              name="cover"
              className="form__file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCoverLabel(e.target.files?.[0]?.name ?? "Upload Cover Letter")}
            />
          </label>
        </div>
        <button type="submit" className="btn btn--blue-l">
          <span className="btn__text">{submitText}</span>
          {/* <SubmitIcon className="btn__icon" /> */}
        </button>
      </form>
      <FormPopup
        open={showPopup}
        onClose={closePopup}
        name={submittedName}
        variant="apply"
      />
      </>
    );
  }

  return (
    <>
    <form ref={formRef} className="form" onSubmit={handleSubmit}>
      <div className="form__inputs">
        <div
          className="form__input form__input--date-wrap"
          onClick={handleDateWrapClick}
        >
          <input
            ref={dateInputRef}
            type="date"
            name="date"
            aria-label="Date"
            required
            min={today}
            className="form__input-date"
          />
        </div>
        <Select
          name="service"
          placeholder="Service"
          className="form__input form__input--select"
          options={SERVICE_OPTIONS}
          required
        />
        <Select
          name="practitioner"
          placeholder="Practitioner"
          className="form__input form__input--select"
          options={PRACTITIONER_OPTIONS}
          required
        />
        <Select
          name="insurance"
          placeholder="Insurance"
          className="form__input form__input--select"
          options={INSURANCE_OPTIONS}
          required
        />
        <input
          className="form__input"
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="name"
          required
        />
        <input
          className="form__input"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          className="form__input"
          type="tel"
          name="number"
          placeholder="Number"
          autoComplete="tel"
          required
        />
      </div>
      <Btn type="submit" className="btn--blue-l" text={submitText} icon={SubmitIcon} />
    </form>
    <FormPopup
      open={showPopup}
      onClose={closePopup}
      name={submittedName}
      variant="appointment"
    />
    </>
  );
}
