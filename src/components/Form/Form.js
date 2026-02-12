import "./Form.scss";
import Send from "@/components/icons/Send";
import Select from "@/components/Select/Select";
import Btn from "@/components/Btn/Btn";

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

export default function Form({ submitText = "Submit", submitIcon: SubmitIcon = Send }) {
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
            placeholder="email"
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
