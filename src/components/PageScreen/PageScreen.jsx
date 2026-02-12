import Btn from "@/components/Btn/Btn";
import Image from "next/image";
import { ArrowLeft } from "@/components/icons";
import "./PageScreen.scss";

export default function PageScreen() {
    return (
        <section className="page-screen">
            <div className="center-wrap">
            <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="page-screen__bg" width={1920} height={1070} />
                <h1 className='simple-title simple-title--large'>Error 404</h1>
                <Btn text="Back to home" icon={ArrowLeft} iconPosition="left" className='btn--blue-l page-screen__btn' />
            </div>
        </section>
    );
}