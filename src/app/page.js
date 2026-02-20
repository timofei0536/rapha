import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";
import { HeroDefaults } from "@/components/Hero/defaults";
import { TeamDefaults } from "@/components/Team/defaults";
import { NewsDefaults } from "@/components/News/defaults";

export default async function Home({ searchParams }) {
  const [servicesProps, infraProps] = await Promise.all([
    getBlockPropsForPage("page", "services", searchParams),
    getBlockPropsForPage("page", "infra", searchParams),
  ]);

  return (
    <main>
      <Hero {...HeroDefaults} />
      <Services {...servicesProps} />
      <Infra {...infraProps} />
      <Team {...TeamDefaults} />
      <News {...NewsDefaults} />
    </main>
  );
}
