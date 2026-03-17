import "./Booking.scss";
import Form from "@/components/Form/Form";

export default function Booking({ title, doctors, insurances }) {
  return (
    <div className="booking">
      <h2 className="booking__title">{title || "Book an appointment"}</h2>
      <Form submitText="Book" doctors={doctors} insurances={insurances} />
    </div>
  );
}
