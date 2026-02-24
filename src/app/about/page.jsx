import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "About",
};

export default async function AboutPage({ searchParams }) {
  const [aboutScreenProps, aboutProps, structureProps, chartProps, newsProps] = await Promise.all([
    getBlockPropsForPage("about", "aboutScreen", searchParams),
    getBlockPropsForPage("about", "about", searchParams),
    getBlockPropsForPage("about", "structure", searchParams),
    getBlockPropsForPage("about", "chart", searchParams),
    getBlockPropsForPage("about", "news", searchParams),
  ]);

  return (
    <main>
      <AboutScreen {...aboutScreenProps} />
      <About {...aboutProps} />
      <Structure {...structureProps} />
      <Chart {...chartProps} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} />
    </main>
  );
}
