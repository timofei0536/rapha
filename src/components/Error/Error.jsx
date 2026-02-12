import Btn from "@/components/Btn/Btn";
import Image from "next/image";
import "./Error.scss";

export default function Error() {
    return (
        <section className="error">
            <div className="center-wrap">
                <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="erorr__bg" width={1920} height={1070} />
                <h1 className='simple-title simple-title--large'>Error 404</h1>
                <Btn text="Back to home" />
            </div>
        </section>
    );
}