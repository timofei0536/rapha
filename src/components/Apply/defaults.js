/**
 * Apply component default props.
 */
export const ApplyDefaults = {
  content: `<h2>Interested in applying to El-Rapha?</h2>
<p>You can complete the online application form below or send your application (resume and cover letter) directly by email to: <strong><a href="mailto:recrutement@el-raphaga.com">recrutement@el-raphaga.com</a></strong></p>
<p>However, we recommend considering geographical proximity when choosing a location. Candidates are encouraged to submit their application electronically with an uploaded resume.</p>`,
  submitText: "Submit",
  roleOptions: [
    { value: "", label: "Role" },
    { value: "nurse", label: "Nurse" },
    { value: "doctor", label: "Doctor" },
    { value: "technician", label: "Technician" },
    { value: "admin", label: "Administration" },
    { value: "other", label: "Other" },
  ],
};
