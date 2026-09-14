import { NextResponse } from "next/server";

const FORM_IDS = {
  appointment: process.env.NEXT_PUBLIC_CF7_APPOINTMENT_ID || "6847",
  apply: process.env.NEXT_PUBLIC_CF7_APPLY_ID || "6841",
};

export async function POST(request) {
  const wp = (process.env.NEXT_PUBLIC_WP_API_URL || "").replace(/\/$/, "");
  if (!wp) {
    return NextResponse.json({ error: "WP URL is not configured" }, { status: 500 });
  }

  const fd = await request.formData();
  const variant = String(fd.get("_form") || "appointment");
  fd.delete("_form");
  const formId = FORM_IDS[variant];
  if (!formId) {
    return NextResponse.json({ error: "Unknown form" }, { status: 400 });
  }

  fd.set("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);

  const res = await fetch(
    `${wp}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
    { method: "POST", body: fd }
  );
  const data = await res.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json(data);
}
