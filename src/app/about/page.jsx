import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";
import { getBlockPropsForPage, getNewsPageFeatured } from "@/lib/rapha";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [aboutScreenProps, aboutProps, structureProps, chartProps, newsProps, featured] = await Promise.all([
    getBlockPropsForPage("about", "aboutScreen", {}),
    getBlockPropsForPage("about", "about", {}),
    getBlockPropsForPage("about", "structure", {}),
    getBlockPropsForPage("about", "chart", {}),
    getBlockPropsForPage("about", "news", {}),
    getNewsPageFeatured("news"),
  ]);

  return (
    <main>
      <AboutScreen {...aboutScreenProps} />
      <About {...aboutProps} />
      <Structure {...structureProps} />
      <Chart {...chartProps} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
