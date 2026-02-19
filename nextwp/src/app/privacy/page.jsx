import TextPage from "@/components/TextPage/TextPage";

export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  const title = "Privacy Policy";
  const content = (
    <>
      <p>
        <strong>
          We respect your privacy and are committed to protecting your personal
          data. This privacy policy explains how we collect, use, and safeguard
          your information when you use our services.
        </strong>
      </p>
      <p>
        We may collect information you provide directly, such as your name,
        email address, and phone number when you contact us or use our forms.
        We also automatically collect certain technical data when you visit our
        website, including your IP address, browser type, and device information.
      </p>
      <p>
        We use the information we collect to provide and improve our services,
        to communicate with you, and to comply with legal obligations. We do not
        sell your personal data to third parties.
      </p>
      <p>
        We implement appropriate technical and organisational measures to
        protect your personal data against unauthorised access, alteration,
        disclosure, or destruction. Your data is stored securely and retained
        only for as long as necessary.
      </p>
      <p>
        You have the right to access, correct, or delete your personal data. You
        may also object to processing or request data portability. To exercise
        these rights, please contact us using the details provided on this
        website.
      </p>
      <p>
        We may update this privacy policy from time to time. We will notify you
        of any changes by posting the new policy on this page and updating the
        effective date. We encourage you to review this policy periodically.
      </p>
    </>
  );

  return (
    <main className="page page--bg-gray">
      <TextPage title={title} content={content} />
    </main>
  );
}
