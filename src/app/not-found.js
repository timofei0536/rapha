"use client";

import PageScreen from "@/components/PageScreen/PageScreen";
import Btn from "@/components/ui/Btn/Btn";
import { ArrowLeft } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <main>
      <PageScreen
        className="page-screen--error"
        title="Error 404"
        image={{ src: "/images/404.png", alt: "rapha-polyclinique" }}
        actions={<Btn text="Back to home" icon={ArrowLeft} iconPosition="left" className="btn--blue-l page-screen__btn" href="/" />}
      />
    </main>
  );
}
