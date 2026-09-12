import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Infra from "../components/Infra/Infra";
import News from "../components/News/News";
import { getBlockPropsForPage, getNewsPageFeatured } from "@/lib/rapha";
import { getBlockProps } from "@/lib/wp-api";
import { ServicesDefaults } from "@/components/Services/defaults";

export default async function Home() {
  const [heroProps, servicesProps, infraProps, teamProps, newsProps, featured, formProps] = await Promise.all([
    getBlockPropsForPage("home", "hero", {}),
    getBlockPropsForPage("home", "services", {}),
    getBlockPropsForPage("home", "infra", {}),
    getBlockPropsForPage("home", "team", {}),
    getBlockPropsForPage("home", "news", {}),
    getNewsPageFeatured("news"),
    getBlockProps("contact", "form", {
      title: "Book an appointment",
      doctors: [],
      insurance: [],
    }),
  ]);

  const servicesList = servicesProps?.services ?? ServicesDefaults.services ?? [];
  const doctors = Array.isArray(formProps?.doctors) ? formProps.doctors : [];
  const insurances = Array.isArray(formProps?.insurance) ? formProps.insurance : [];
  return (
    <main>
      <Hero {...heroProps} doctors={doctors} insurances={insurances} />
      <Services {...servicesProps} services={servicesList} />
      <Infra {...infraProps} />
      <Team {...teamProps} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
