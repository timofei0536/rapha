import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";

export const metadata = {
    title: "Careers",
};

const PAGE_TITLE = "Join Our Team at El-Rapha";
const PAGE_IMAGE = { src: "/images/careers-page.png", alt: "Join Our Team at El-Rapha" };

export default function CareersPage() {
    return (
        <main>
            <PageScreen title={PAGE_TITLE} image={PAGE_IMAGE} />
            <Careers />
        </main>
    );
}
