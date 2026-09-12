import "./Booking.scss";
import Form from "@/components/Form/Form";

export default function Booking({ title, doctors, insurances, services }) {
  return (
    <div className="booking">
      {title ? <h2 className="booking__title">{title}</h2> : null}
      <Form doctors={doctors} insurances={insurances} services={services} />
    </div>
  );
}
