import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { HeroDefaults } from "@/components/Hero/defaults";
import { ServicesDefaults } from "@/components/Services/defaults";
import { TeamDefaults } from "@/components/Team/defaults";
import { InfraDefaults } from "@/components/Infra/defaults";
import { NewsDefaults } from "@/components/News/defaults";

export default function Home() {
  return (
      <main>
         <Hero {...HeroDefaults} />
         <Services {...ServicesDefaults} />
         <Infra {...InfraDefaults} />
         <Team {...TeamDefaults} />
         <News {...NewsDefaults} />
      </main>
  );
}
