import AboutScreen from "@/components/AboutScreen/AboutScreen";
import About from "@/components/About/About";
import Structure from "@/components/Structure/Structure";
import Chart from "@/components/Chart/Chart";
import News from "@/components/News/News";

export const metadata = {
    title: "About",
};

export default function AboutPage() {
    return (
        <main>
            <AboutScreen />
            <About />
            <Structure />
            <Chart />
            <News />
        </main>
    );
}
