import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";
import { getBlocksPropsForPage, getNewsPageFeatured } from "@/lib/rapha";

export const metadata = {
  title: "About",
  description:
    "Learn about El-Rapha polyclinic: our mission, structure, medical team, and how we care for patients.",
};

export default async function AboutPage() {
  const [about, featured] = await Promise.all([
    getBlocksPropsForPage("about", ["aboutScreen", "about", "structure", "chart", "news"]),
    getNewsPageFeatured("news"),
  ]);
  const {
    aboutScreen: aboutScreenProps,
    about: aboutProps,
    structure: structureProps,
    chart: chartProps,
    news: newsProps,
  } = about;

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
