import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";

export const metadata = {
    title: "Our Services",
};

const ServiceDefaults = {
    services: [
        { slug: "resuscitation", title: "Resuscitation" },
        { slug: "surgery-operating-room", title: "Surgery & Operating Room" },
        { slug: "emergencies", title: "Emergencies" },
        { slug: "internal-medicine-dialysis", title: "Internal Medicine Dialysis" },
        { slug: "analysis-laboratory", title: "Analysis Laboratory" },
        { slug: "other-specialties", title: "Other Specialties" },
        { slug: "hospitality-catering", title: "Hospitality & Catering" },
        { slug: "medical-imaging", title: "Medical Imaging" },
        { slug: "gynecology-obstetrics", title: "Gynecology-Obstetrics" },
    ],
};

const NewsDefaults = {
    title: "News",
    items: [
        { image: { src: "/images/news1.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
        { image: { src: "/images/news2.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
        { image: { src: "/images/news3.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    ],
};

export default function ServicesPage() {
    return (
        <main>
            <PageScreen className='page-screen--blur'>
                <Image
                    src="/images/services-screen.png"
                    alt="Our Services"
                    className="page-screen__bg"
                    width={1920}
                    height={1070}
                />
                <h1 className="simple-title simple-title--large">Our<br/> Services</h1>
            </PageScreen>
            <Service {...ServiceDefaults} />
            <News {...NewsDefaults} />
        </main>
    );
}
