import Results from "@/components/Results/Results";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Search Results",
};

function getQueryFromParams(params) {
  const q = params?.q ?? params?.query;
  return Array.isArray(q) ? q[0] ?? "" : (q ?? "");
}

export default async function ResultsPage({ searchParams }) {
  const resolvedParams = typeof searchParams?.then === "function" ? await searchParams : searchParams ?? {};
  const resultsProps = await getBlockPropsForPage("results", "results", resolvedParams);
  const query = getQueryFromParams(resolvedParams) || resultsProps.query || "";

  return (
    <main>
      <Results {...resultsProps} query={query} />
    </main>
  );
}
