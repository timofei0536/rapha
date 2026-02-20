/**
 * Project-specific helpers for El-Rapha. Use for rapha-only logic, not generic wp-api/acf.
 */
import { getPageProps, getBlockProps } from "@/lib/wp-api";
import { ContactDefaults } from "@/components/Contact/defaults";
import { CareersDefaults } from "@/components/Careers/defaults";
import { InfraDefaults } from "@/components/Infra/defaults";
import { ServicesDefaults } from "@/components/Services/defaults";
import { HeroDefaults } from "@/components/Hero/defaults";
import { TeamDefaults } from "@/components/Team/defaults";
import { NewsDefaults } from "@/components/News/defaults";
import { AboutScreenDefaults } from "@/components/AboutScreen/defaults";
import { AboutDefaults } from "@/components/About/defaults";
import { StructureDefaults } from "@/components/Structure/defaults";
import { ChartDefaults } from "@/components/Chart/defaults";
import { ServiceDefaults } from "@/components/Service/defaults";
import { ResultsDefaults } from "@/components/Results/defaults";

/** Defaults by page slug and block key. Used by getBlockPropsForPage. */
const blockDefaults = {
  careers: { careers: CareersDefaults },
  contact: { contact: ContactDefaults },
  home: {
    hero: HeroDefaults,
    services: ServicesDefaults,
    infra: InfraDefaults,
    team: TeamDefaults,
    news: NewsDefaults,
  },
  about: {
    aboutScreen: AboutScreenDefaults,
    about: AboutDefaults,
    structure: StructureDefaults,
    chart: ChartDefaults,
    news: NewsDefaults,
  },
  services: { service: ServiceDefaults, news: NewsDefaults },
  news: { news: NewsDefaults },
  results: { results: ResultsDefaults },
};

/**
 * Get block props from WP; defaults are resolved internally (no need to import them on the page).
 * @param {string} slug Page slug (e.g. 'home', 'careers', 'contact')
 * @param {string} componentKey Block key (e.g. 'infra', 'careers', 'contact')
 * @param {Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>} [searchParams]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getBlockPropsForPage(slug, componentKey, searchParams) {
  const defaults = blockDefaults[slug]?.[componentKey];
  if (!defaults) throw new Error(`No defaults registered for slug="${slug}" componentKey="${componentKey}"`);
  return getBlockProps(slug, componentKey, defaults, searchParams);
}

/**
 * Contact info for layout (header/footer): phone, address, email from Contact page data.
 * @returns {Promise<{ phone: { text: string; href: string } | null; address: { text: string; href: string } | null; email: { text: string; href: string } | null }>}
 */
export async function getContactInfoForLayout() {
  const strictWp = process.env.NEXT_PUBLIC_STRICT_WP === "true";
  const contactProps = await getPageProps("contact", "contact", ContactDefaults, {
    strictWp,
  });
  const items = Array.isArray(contactProps?.items) ? contactProps.items : [];
  const link = (i) => {
    const l = items[i]?.link;
    return l?.href ? { text: l.text ?? "", href: l.href } : null;
  };
  return {
    phone: link(1),
    address: link(0),
    email: link(2),
  };
}
