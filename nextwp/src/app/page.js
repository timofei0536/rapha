import Image from "next/image";
import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";

export default function Home() {
  return (
      <main>
         <Hero />
         <Services />
         <Infra />
         <Team />
         <News />
      </main>
  );
}
