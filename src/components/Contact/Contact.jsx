"use client";

import "./Contact.scss";
import Location from "@/components/ui/icons/Location";
import Phone from "@/components/ui/icons/Phone";
import Mail from "@/components/ui/icons/Mail";
import Booking from "@/components/Booking/Booking";

const CONTACT_ICONS = [Location, Phone, Mail];

export default function Contact(props) {
  const { map, items } = props;
  return (
    <section className="contact">
      <div className="center-wrap center-wrap--small">
        {map?.src?.trim() && (
          <div className="contact__map">
            <iframe
              title={map.title ?? ""}
              src={map.src}
              className="contact__map-iframe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}

        <div className="contact__info">
          {(items || []).map((item, i) => {
            const Icon = CONTACT_ICONS[i] ?? Location;
            const { link } = item;
            const linkProps = {
              href: link?.href ?? "#",
              target: link?.target ?? undefined,
              rel: link.target === "_blank" ? "noopener noreferrer" : undefined,
              className: i === 0 ? "contact__info-link link-hover link-hover--simple" : "link-hover",
            };
            const lines = link?.text?.split("\n");
            const linkContent = lines?.length > 1
              ? lines.map((line, j) => <span key={j}>{line}{j < lines.length - 1 && <br />}</span>)
              : link?.text;
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
