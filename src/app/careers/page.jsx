import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import Apply from "@/components/Apply/Apply";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Careers",
  description:
    "Join the El-Rapha team: view open roles and apply to work at our polyclinic.",
};

export default async function CareersPage() {
  const [props, pageScreenProps] = await Promise.all([
    getBlockPropsForPage("careers", "careers", {}),
    getBlockPropsForPage("careers", "pageScreen", {}),
  ]);

  return (
    <main>
      <PageScreen {...pageScreenProps} />
      <Careers {...props} />
      <Apply />
    </main>
  );
}
