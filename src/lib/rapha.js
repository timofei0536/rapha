/**
 * Project-specific helpers for El-Rapha. Use for rapha-only logic, not generic wp-api/acf.
 */
import { getPageProps } from "@/lib/wp-api";
import { ContactDefaults } from "@/components/Contact/defaults";

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
