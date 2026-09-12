import TextPage from "@/components/TextPage/TextPage";
import { getPageBySlug } from "@/lib/wp-api";
import { normalizeContent } from "@/lib/acf";

function decodeTitle(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&#038;/g, "&").replace(/&amp;/g, "&").trim();
}

function getTitle(page) {
  const raw = page?.title?.rendered ?? page?.acf?.pageTitle ?? "";
  return decodeTitle(typeof raw === "string" ? raw : String(raw || ""));
}

function getContent(page) {
  const acf = page?.acf && typeof page.acf === "object" ? page.acf : {};
  const fromAcf = normalizeContent(acf.pageContent) || normalizeContent(acf.content);
  if (fromAcf) return fromAcf;
  const rendered = page?.content?.rendered;
  return rendered ? String(rendered).trim() : "";
}

export const metadata = {
  title: "Privacy",
  description:
    "Privacy policy of El-Rapha polyclinic: how we collect, use, and protect your personal information.",
};

export default async function PrivacyPage() {
  const page = (await getPageBySlug("privacy-policy")) || (await getPageBySlug("privacy"));
  return (
    <main className="page page--bg-gray">
      <TextPage title={getTitle(page)} content={getContent(page)} />
    </main>
  );
}
