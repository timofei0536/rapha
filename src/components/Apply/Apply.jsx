"use client";

import "./Apply.scss";
import Form from "@/components/Form/Form";
import Send from "@/components/ui/icons/Send";
import { useGeneral } from "@/context/GeneralContext";

function toRoleOptions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        const label = entry.trim();
        if (!label) return null;
        const value = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return { value: value || "role", label };
      }
      if (entry.value && entry.label) return { value: String(entry.value), label: String(entry.label) };
      const label = String(entry.item ?? entry.title ?? entry.label ?? entry.text ?? "").trim();
      if (!label) return null;
      const value = String(entry.value ?? label)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { value: value || "role", label };
    })
    .filter(Boolean);
}

export default function Apply({ content, submitText, roleOptions, roles, items } = {}) {
  const { submit: submitLabel } = useGeneral();
  const roleList = toRoleOptions(roleOptions ?? roles ?? items);

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
            submitText={submitText ?? submitLabel}
            submitIcon={Send}
            roleOptions={roleList}
          />
        </div>
      </div>
    </section>
  );
}
