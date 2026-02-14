import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import Decor from "@/components/ui/icons/Decor";

export const metadata = {
    title: "Careers",
};

export default function CareersPage() {
    return (
        <main>
            <PageScreen>
                <Image
                    src="/images/careers-page.png"
                    alt="Join Our Team at El-Rapha"
                    className="page-screen__bg"
                    width={1920}
                    height={1070}
                />
                <h1 className="simple-title simple-title--large">Join Our Team at El-Rapha</h1>
                <Decor className='page-screen__decore' />
            </PageScreen>
            <Careers />
        </main>
    );
}
