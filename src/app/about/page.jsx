import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";
import { AboutScreenDefaults } from "@/components/AboutScreen/defaults";
import { AboutDefaults } from "@/components/About/defaults";
import { StructureDefaults } from "@/components/Structure/defaults";
import { ChartDefaults } from "@/components/Chart/defaults";
import { NewsDefaults } from "@/components/News/defaults";

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
