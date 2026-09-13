import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import Apply from "@/components/Apply/Apply";
import { getBlocksPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Careers",
  description:
    "Join the El-Rapha team: view open roles and apply to work at our polyclinic.",
};

export default async function CareersPage() {
  const { careers: props, pageScreen: pageScreenProps, apply: applyProps } = await getBlocksPropsForPage(
    "careers",
    ["careers", "pageScreen", "apply"]
  );

  return (
    <main>
      <PageScreen {...pageScreenProps} />
      <Careers {...props} />
      <Apply {...applyProps} />
    </main>
  );
}
