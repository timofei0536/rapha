import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";
import {
  AboutScreenDefaults,
  AboutDefaults,
  StructureDefaults,
  ChartDefaults,
  NewsDefaults,
} from "./about-defaults";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
    return (
        <main>
            <AboutScreen {...AboutScreenDefaults} />
            <About {...AboutDefaults} />
            <Structure {...StructureDefaults} />
            <Chart {...ChartDefaults} />
            <News {...NewsDefaults} />
        </main>
    );
}
