import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";
import { HeroDefaults } from "@/components/Hero/defaults";
import { ServicesDefaults } from "@/components/Services/defaults";
import { TeamDefaults } from "@/components/Team/defaults";
import { NewsDefaults } from "@/components/News/defaults";

export default async function Home({ searchParams }) {
  const infraProps = await getBlockPropsForPage("page", "infra", searchParams);

  return (
    <main>
      <Hero {...HeroDefaults} />
      <Services {...ServicesDefaults} />
      <Infra {...infraProps} />
      <Team {...TeamDefaults} />
      <News {...NewsDefaults} />
    </main>
  );
}
