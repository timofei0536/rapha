import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import {
  HeroDefaults,
  ServicesDefaults,
  TeamDefaults,
  InfraDefaults,
  NewsDefaults,
} from "./page-defaults";

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
