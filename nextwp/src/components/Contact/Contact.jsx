"use client";

import "./Contact.scss";
import Location from "@/components/ui/icons/Location";
import Phone from "@/components/ui/icons/Phone";
import Mail from "@/components/ui/icons/Mail";
import Booking from "@/components/Booking/Booking";

const DEFAULT_MAP = {
  title: "Polyclinique El Rapha - Libreville",
  src: "https://www.google.com/maps?q=Polyclinique+El+Rapha+Libreville+Gabon&z=16&output=embed",
};

const CONTACT_ICONS = [Location, Phone, Mail];

const DEFAULT_ITEMS = [
  {
    title: "Polyclinique El Rapha",
    link: {
      text: "Three Quarters,\n256 Libreville,\nGabon",
      href: "https://www.google.com/maps/search/?api=1&query=Three+Quarters,+256+Libreville,+Gabon",
      target: "_blank",
    },
  },
  {
    title: "Call us",
    link: {
      text: "+241 077 986 660",
      href: "tel:+241077986660",
    },
  },
  {
    title: "Email us",
    link: {
      text: "contact@el-raphaga.com",
      href: "mailto:contact@el-raphaga.com",
    },
  },
];

export default function Contact({ map = DEFAULT_MAP, items = DEFAULT_ITEMS }) {
  return (
    <section className="contact">
      <div className="center-wrap center-wrap--small">
        <div className="contact__map">
          <iframe
            title={map.title}
            src={map.src}
            className="contact__map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="contact__info">
          {items.map((item, i) => {
            const Icon = CONTACT_ICONS[i] ?? Location;
            const { link } = item;
            const linkProps = {
              href: link.href,
              target: link.target ?? undefined,
              rel: link.target === "_blank" ? "noopener noreferrer" : undefined,
              className: i === 0 ? "contact__info-link link-hover link-hover--simple" : "link-hover",
            };
            const lines = link.text?.split("\n");
            const linkContent = lines?.length > 1
              ? lines.map((line, j) => <span key={j}>{line}{j < lines.length - 1 && <br />}</span>)
              : link.text;
            return (
              <div key={i} className="contact__info-item">
                <h3 className="contact__info-title">{item.title}</h3>
                <div className="contact__info-text">
                  <div className="contact__info-icon-wrap">
                    <Icon className="contact__info-icon" aria-hidden />
                  </div>
                  <a {...linkProps}>{linkContent}</a>
                </div>
              </div>
            );
          })}
        </div>

        <Booking />
      </div>
    </section>
  );
}
