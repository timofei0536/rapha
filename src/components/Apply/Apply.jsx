"use client";

import "./Apply.scss";
import Form from "@/components/Form/Form";
import Send from "@/components/ui/icons/Send";
import { ApplyDefaults } from "./defaults";

export default function Apply(props) {
  const {
    heading = ApplyDefaults.heading,
    email = ApplyDefaults.email,
    textIntro = ApplyDefaults.textIntro,
    textNote = ApplyDefaults.textNote,
    submitText = ApplyDefaults.submitText,
    roleOptions = ApplyDefaults.roleOptions,
  } = { ...ApplyDefaults, ...props };

  return (
    <section className="apply">
      <div className="center-wrap">
        <div className="apply__inner">
          <div className="apply__info">
            <h2 className="apply__heading simple-title">{heading}</h2>
            <p className="apply__text">
              {textIntro}{" "}
              <a href={`mailto:${email}`} className="apply__link">
                {email}
              </a>
            </p>
            <p className="apply__text">{textNote}</p>
          </div>
          <Form
            variant="apply"
            submitText={submitText}
            submitIcon={Send}
            roleOptions={roleOptions}
          />
        </div>
      </div>
    </section>
  );
}
