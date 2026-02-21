"use client";

import "./Form.scss";
import Send from "@/components/ui/icons/Send";
import Upload from "@/components/ui/icons/Upload";
import Select from "@/components/ui/Select/Select";
import Btn from "@/components/ui/Btn/Btn";

const DATE_OPTIONS = [
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This week" },
  { value: "next-week", label: "Next week" },
  { value: "in-two-weeks", label: "In two weeks" },
];

const SERVICE_OPTIONS = [
  { value: "general", label: "General consultation" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "gynecology", label: "Gynecology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "lab", label: "Laboratory tests" },
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
  if (variant === "apply") {
    return (
      <form className="form form--apply" onSubmit={(e) => e.preventDefault()}>
        <div className="form__inputs">
          <input
            className="form__input"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            aria-label="Name"
          />
          <Select
            name="role"
            placeholder="Role"
            className="form__input form__input--select"
            options={roleOptions}
          />
          <input
            className="form__input"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            aria-label="Email"
          />
          <input
            className="form__input"
            type="tel"
            name="number"
            placeholder="Number"
            autoComplete="tel"
            aria-label="Number"
          />
          <input
            className="form__input"
            type="date"
            name="date"
            aria-label="Date"
          />
          <div className="form__sep"></div>
          <label className="form__upload">
            <span className="form__upload-text">Upload CV</span>
            <Upload className="form__upload-icon" />
            <input type="file" name="cv" className="form__file" accept=".pdf,.doc,.docx" />
          </label>
          <label className="form__upload">
            <span className="form__upload-text">Upload Cover Letter</span>
            <Upload className="form__upload-icon" />
            <input type="file" name="cover" className="form__file" accept=".pdf,.doc,.docx" />
          </label>
        </div>
        <button type="submit" className="btn btn--blue-l">
          <span className="btn__text">{submitText}</span>
          {/* <SubmitIcon className="btn__icon" /> */}
        </button>
      </form>
    );
  }

  return (
    <form className="form">
      <div className="form__inputs">
        <Select
          name="date"
          placeholder="Appointment date"
          className="form__input form__input--select"
          options={DATE_OPTIONS}
        />
        <Select
          name="service"
          placeholder="Service"
          className="form__input form__input--select"
          options={SERVICE_OPTIONS}
        />
        <Select
          name="practitioner"
          placeholder="Practitioner"
          className="form__input form__input--select"
          options={PRACTITIONER_OPTIONS}
        />
        <Select
          name="insurance"
          placeholder="Insurance"
          className="form__input form__input--select"
          options={INSURANCE_OPTIONS}
        />
        <input
          className="form__input"
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="name"
        />
        <input
          className="form__input"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
        />
        <input
          className="form__input"
          type="tel"
          name="number"
          placeholder="Number"
          autoComplete="tel"
        />
      </div>
      <Btn className="btn--blue-l" text={submitText} icon={SubmitIcon} />
    </form>
  );
}
