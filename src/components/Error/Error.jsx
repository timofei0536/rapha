import Btn from "@/components/Btn/Btn";
import Image from "next/image";
import { ArrowLeft } from "@/components/icons";
import "./Error.scss";

export default function Error() {
    return (
        <section className="error">
            <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="error__bg" width={1920} height={1070} />
            <div className="center-wrap">
                <h1 className='simple-title simple-title--large'>Error 404</h1>
                <Btn text="Back to home" icon={ArrowLeft} iconPosition="left" className='btn--blue-l error__btn' />
            </div>
        </section>
    );
}