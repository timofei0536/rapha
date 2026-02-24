import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage, getWpServices } from "@/lib/rapha";
import { ServicesDefaults } from "@/components/Services/defaults";

export default async function Home() {
  const [heroProps, servicesProps, infraProps, teamProps, newsProps, wpServices] = await Promise.all([
    getBlockPropsForPage("home", "hero", {}),
    getBlockPropsForPage("home", "services", {}),
    getBlockPropsForPage("home", "infra", {}),
    getBlockPropsForPage("home", "team", {}),
    getBlockPropsForPage("home", "news", {}),
    getWpServices(),
  ]);

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(servicesProps?.services) && servicesProps.services.length > 0 ? servicesProps.services : null;
  const servicesList = rawFromWp ?? rawFromBlock ?? ServicesDefaults.services ?? [];
  return (
    <main>
      <Hero {...heroProps} />
      <Services {...servicesProps} services={servicesList} />
      <Infra {...infraProps} />
      <Team {...teamProps} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} />
    </main>
  );
}
