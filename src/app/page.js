import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getPagePropsFromSearchParams } from "@/lib/wp-api";
import { HeroDefaults } from "@/components/Hero/defaults";
import { ServicesDefaults } from "@/components/Services/defaults";
import { TeamDefaults } from "@/components/Team/defaults";
import { InfraDefaults } from "@/components/Infra/defaults";
import { NewsDefaults } from "@/components/News/defaults";

const HOME_PAGE_SLUG = "page";

export default async function Home({ searchParams }) {
  const infraProps = await getPagePropsFromSearchParams(
    HOME_PAGE_SLUG,
    "infra",
    InfraDefaults,
    searchParams
  );

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
