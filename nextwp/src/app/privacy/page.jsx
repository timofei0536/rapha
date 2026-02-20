import TextPage from "@/components/TextPage/TextPage";
import { PrivacyDefaults } from "@/components/TextPage/defaults";

export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main className="page page--bg-gray">
      <TextPage title={PrivacyDefaults.title} content={PrivacyDefaults.content} />
    </main>
  );
}
