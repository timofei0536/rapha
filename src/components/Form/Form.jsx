"use client";

import { useState, useRef } from "react";
import "./Form.scss";
import Send from "@/components/ui/icons/Send";
import Upload from "@/components/ui/icons/Upload";
import Select from "@/components/ui/Select/Select";
import FormPopup from "@/components/FormPopup/FormPopup";
import Btn from "@/components/ui/Btn/Btn";
import { ServiceDefaults } from "@/components/Service/defaults";
import { useGeneral } from "@/context/GeneralContext";

const SERVICE_OPTIONS = [
  ...(ServiceDefaults.services || []).map((s) => ({ value: s.slug, label: s.title })),
  { value: "other", label: "Other" },
];

const normalizeRepeaterToOptions = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((entry) => {
      const label = String(entry?.item ?? "").trim();
      if (!label) return null;
      const value = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { value: value || "doctor", label };
    })
    .filter(Boolean);
};

export default function Form({
  variant = "appointment",
  submitText,
  submitIcon: SubmitIcon = Send,
  roleOptions = [],
  doctors = [],
  insurances = [],
  animInitialStyle,
}) {
  const { submit: submitLabel } = useGeneral();
  const submitButtonText = submitText ?? submitLabel ?? "Submit";
  const doctorsFromCms = normalizeRepeaterToOptions(doctors);
  const insurancesFromCms = normalizeRepeaterToOptions(insurances);
  const practitionerOptions =
    doctorsFromCms.length > 0 ? doctorsFromCms : [{ value: "any", label: "Any available" }];
  const insuranceOptions =
    insurancesFromCms.length > 0 ? insurancesFromCms : [{ value: "none", label: "No insurance" }];
  const animProps = {
    ...(animInitialStyle && { className: 'anim-initial', style: animInitialStyle }),
  };
  const [cvLabel, setCvLabel] = useState("Upload CV");
  const [coverLabel, setCoverLabel] = useState("Upload Cover Letter");
  const [showPopup, setShowPopup] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [formKey, setFormKey] = useState(0);
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

  const closePopup = () => {
    setShowPopup(false);
    setFormKey((k) => k + 1);
    setCvLabel("Upload CV");
    setCoverLabel("Upload Cover Letter");
  };

  if (variant === "apply") {
    return (
      <>
      <form key={formKey} ref={formRef} className={`form form--apply${animProps.className ? ` ${animProps.className}` : ''}`} style={animProps.style} onSubmit={handleSubmit}>
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
          <span className="btn__text">{submitButtonText}</span>
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
    <form key={formKey} ref={formRef} className={`form${animProps.className ? ` ${animProps.className}` : ''}`} style={animProps.style} onSubmit={handleSubmit}>
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
          options={practitionerOptions}
          required
        />
        <Select
          name="insurance"
          placeholder="Insurance"
          className="form__input form__input--select"
          options={insuranceOptions}
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
      <Btn type="submit" className="btn--blue-l" text={submitButtonText} icon={SubmitIcon} />
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
