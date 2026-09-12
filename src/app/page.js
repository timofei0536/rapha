import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage, getNewsPageFeatured, getWpServices } from "@/lib/rapha";
import { getPageProps } from "@/lib/wp-api";

export const metadata = {
  description:
    "Welcome to El-Rapha polyclinic: book an appointment, explore our medical services, team, infrastructure, and latest news.",
};

export default async function Home() {
  const [heroProps, servicesProps, infraProps, teamProps, newsProps, featured, formProps, wpServices] = await Promise.all([
    getBlockPropsForPage("home", "hero"),
    getBlockPropsForPage("home", "services"),
    getBlockPropsForPage("home", "infra"),
    getBlockPropsForPage("home", "team"),
    getBlockPropsForPage("home", "news"),
    getNewsPageFeatured("news"),
    getPageProps("contact", "form"),
    getWpServices(),
  ]);

  const servicesList = Array.isArray(servicesProps?.services) ? servicesProps.services : [];
  const doctors = Array.isArray(formProps?.doctors) ? formProps.doctors : [];
  const insurances = Array.isArray(formProps?.insurance) ? formProps.insurance : [];
  return (
    <main>
      <Hero {...heroProps} doctors={doctors} insurances={insurances} services={wpServices} />
      <Services {...servicesProps} services={servicesList} />
      <Infra {...infraProps} />
      <Team {...teamProps} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
