import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import Apply from "@/components/Apply/Apply";
import { getBlockPropsForPage } from "@/lib/rapha";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers",
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
