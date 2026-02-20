import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage } from "@/lib/rapha";

export default async function Home({ searchParams }) {
  const [heroProps, servicesProps, infraProps, teamProps, newsProps] = await Promise.all([
    getBlockPropsForPage("page", "hero", searchParams),
    getBlockPropsForPage("page", "services", searchParams),
    getBlockPropsForPage("page", "infra", searchParams),
    getBlockPropsForPage("page", "team", searchParams),
    getBlockPropsForPage("page", "news", searchParams),
  ]);

  return (
    <main>
      <Hero {...heroProps} />
      <Services {...servicesProps} />
      <Infra {...infraProps} />
      <Team {...teamProps} />
      <News {...newsProps} />
    </main>
  );
}
