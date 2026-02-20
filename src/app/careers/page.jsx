import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import { getPageComponentData, normalizeGallery, orDefault } from "@/lib/wp-api";

export const metadata = {
    title: "Careers",
};

const PAGE_TITLE = "Join Our Team at El-Rapha";
const PAGE_IMAGE = { src: "/images/careers-page.png", alt: "Join Our Team at El-Rapha" };

const CareersDefaults = {
    title: "At El-Rapha Hospital, we're dedicated to providing compassionate, high-quality healthcare to our community and beyond.",
    content: `<p>Our team is made up of passionate professionals, doctors, nurses, technicians, and support staff, all working together to improve lives every day.</p>
<p>We believe in continuous learning, teamwork, and respect for every individual. Whether you're starting your medical career or bringing years of experience, you'll find an environment that values your growth and your contribution.</p>
<p>Join us in shaping a healthier future for Gabon and the region.</p>`,
    gallery: [
        { image: { src: "/images/careers1.png", alt: "Medical staff in laboratory" } },
        { image: { src: "/images/careers2.png", alt: "Healthcare professional with child patient" } },
        { image: { src: "/images/careers3.png", alt: "El-Rapha Hospital team" } },
    ],
};

export default async function CareersPage() {
    const data = await getPageComponentData("careers", "careers");
    const title = orDefault(data?.title) ?? CareersDefaults.title;
    const content = orDefault(data?.content) ?? CareersDefaults.content;
    const gallery = normalizeGallery(data?.gallery) ?? CareersDefaults.gallery;

    return (
        <main>
            <PageScreen title={PAGE_TITLE} image={PAGE_IMAGE} />
            <Careers title={title} content={content} gallery={gallery} />
        </main>
    );
}
