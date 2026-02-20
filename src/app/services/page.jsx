import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { ServiceDefaults } from "@/components/Service/defaults";
import { NewsDefaults } from "@/components/News/defaults";

export const metadata = {
  title: "Our Services",
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
