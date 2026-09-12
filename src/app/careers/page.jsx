import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import Apply from "@/components/Apply/Apply";
import { getBlockPropsForPage } from "@/lib/rapha";
import { getPageProps } from "@/lib/wp-api";

export const metadata = {
  title: "Careers",
  description:
    "Join the El-Rapha team: view open roles and apply to work at our polyclinic.",
};

export default async function CareersPage() {
  const [props, pageScreenProps, applyProps] = await Promise.all([
    getBlockPropsForPage("careers", "careers"),
    getBlockPropsForPage("careers", "pageScreen"),
    getPageProps("careers", "apply"),
  ]);

  return (
    <main>
      <PageScreen {...pageScreenProps} />
      <Careers {...props} />
      <Apply {...applyProps} />
    </main>
  );
}
