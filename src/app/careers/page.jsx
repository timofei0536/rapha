import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import { getPageComponentData, normalizeGallery, orDefault } from "@/lib/wp-api";

export const metadata = {
    title: "Careers",
};

const PAGE_TITLE = "Join Our Team at El-Rapha";
const PAGE_IMAGE = { src: "/images/careers-page.png", alt: "Join Our Team at El-Rapha" };

export default async function CareersPage() {
    const data = await getPageComponentData("careers", "careers");
    const title = orDefault(data?.title);
    const content = orDefault(data?.content);
    const gallery = normalizeGallery(data?.gallery);

    return (
        <main>
            <PageScreen title={PAGE_TITLE} image={PAGE_IMAGE} />
            <Careers title={title} content={content} gallery={gallery} />
        </main>
    );
}
