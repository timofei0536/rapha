import Results from "@/components/Results/Results";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Search Results",
};

function getQueryFromParams(params) {
  const q = params?.q ?? params?.query;
  return Array.isArray(q) ? q[0] ?? "" : (q ?? "");
}

export default async function ResultsPage() {
  const resultsProps = await getBlockPropsForPage("results", "results", {});
  const query = resultsProps.query || "";

  return (
    <main>
      <Results {...resultsProps} query={query} />
    </main>
  );
}
