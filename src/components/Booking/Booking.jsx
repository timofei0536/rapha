import "./Booking.scss";
import Form from "@/components/Form/Form";

export default function Booking() {
  return (
    <div className="booking">
      <h2 className="booking__title">Book an appointment</h2>
      <Form submitText="Book" />
    </div>
  );
}
