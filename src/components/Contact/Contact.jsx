"use client";

import "./Contact.scss";
import Location from "@/components/icons/Location";
import Phone from "@/components/icons/Phone";
import Mail from "@/components/icons/Mail";
import Booking from "@/components/Booking/Booking";


export default function Contact() {
  return (
    <section className="contact">
      <div className="center-wrap center-wrap--small">
        <div className="contact__map">
          <iframe
            title="Polyclinique El Rapha - Libreville"
            src="https://www.google.com/maps?q=Polyclinique+El+Rapha+Libreville+Gabon&z=16&output=embed"
            className="contact__map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="contact__info">
          <div className="contact__info-item">
            <h3 className="contact__info-title">Polyclinique El Rapha</h3>
            <div className="contact__info-text">
              <div className="contact__info-icon-wrap">
                <Location className="contact__info-icon" aria-hidden />
              </div>
              Three Quarters,<br/> 256 Libreville,<br/> Gabon
            </div>
          </div>
          <div className="contact__info-item">
            <h3 className="contact__info-title">Call us</h3>
            <div className="contact__info-text">
              <div className="contact__info-icon-wrap">
                <Phone className="contact__info-icon" aria-hidden />
              </div>
              <a href="tel:+241077986660">+241 077 986 660</a>
            </div>
          </div>
          <div className="contact__info-item">
            <h3 className="contact__info-title">Email us</h3>
            <div className="contact__info-text">
              <div className="contact__info-icon-wrap">
                <Mail className="contact__info-icon" aria-hidden />
              </div>
              <a href="mailto:contact@el-raphaga.com">contact@el-raphaga.com</a>
            </div>
          </div>
        </div>

        <Booking />
      </div>
    </section>
  );
}
