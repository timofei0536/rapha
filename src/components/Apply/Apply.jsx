"use client";

import "./Apply.scss";
import Form from "@/components/Form/Form";
import Send from "@/components/ui/icons/Send";
import { ApplyDefaults } from "./defaults";
import { useGeneral } from "@/context/GeneralContext";

export default function Apply(props) {
  const {
    content = ApplyDefaults.content,
    submitText,
    roleOptions = ApplyDefaults.roleOptions,
  } = { ...ApplyDefaults, ...props };
  const { submit: submitLabel } = useGeneral();

  return (
    <section className="apply">
      <div className="center-wrap center-wrap--small">
        <div className="apply__wrap">
          <div className="apply__info">
            <div
              className="apply__content content"
              dangerouslySetInnerHTML={{ __html: typeof content === "string" ? content : "" }}
            />
          </div>
          <Form
            variant="apply"
            submitText={submitText ?? submitLabel ?? ApplyDefaults.submitText}
            submitIcon={Send}
            roleOptions={roleOptions}
          />
        </div>
      </div>
    </section>
  );
}
