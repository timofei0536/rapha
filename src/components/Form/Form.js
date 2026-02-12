import "./Form.scss";
import Send from "@/components/icons/Send";
// import Select from "@/components/icons/Select";
import Btn from "@/components/Btn/Btn";

export default function Form() {
  return (
    <form className="form">
        <div className="form__inputs">
          <select className="form__input form__input--select" name="date" defaultValue="">
            <option value="" disabled>Appointment date</option>
          </select>
          {/* <Select className="form__chevron" aria-hidden /> */}
          <select className="form__input form__input--select" name="service" defaultValue="">
            <option value="" disabled>Service</option>
          </select>
          {/* <Select className="form__chevron" aria-hidden /> */}
          <select className="form__input form__input--select" name="practitioner" defaultValue="">
            <option value="" disabled>Practitioner</option>
          </select>
          {/* <Select className="form__chevron" aria-hidden /> */}
          <select className="form__input form__input--select" name="insurance" defaultValue="">
            <option value="" disabled>Insurance</option>
          </select>
          {/* <Select className="form__chevron" aria-hidden /> */}
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

          <Btn className="btn--blue-l" text="Submit" icon={Send} />
          
    </form>
  );
}
