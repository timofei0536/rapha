import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import Btn from "@/components/Btn/Btn";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <main>
      <PageScreen className="page-screen__error">
        <Image src="/images/hero-image.png" alt="rapha-polyclinique" className="page-screen__bg" width={1920} height={1070} />
        <h1 className="simple-title simple-title--large">Error 404</h1>
        <Btn text="Back to home" icon={ArrowLeft} iconPosition="left" className="btn--blue-l page-screen__btn" />
      </PageScreen>
    </main>
  );
}
