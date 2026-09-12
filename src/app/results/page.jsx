import { Suspense } from "react";
import ResultsWithQuery from "@/components/Results/ResultsWithQuery";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Search Results",
  description: "Search pages, news, and services on the El-Rapha polyclinic website.",
};

export default async function ResultsPage() {
  const resultsProps = await getBlockPropsForPage("results", "results");

  return (
    <main>
      <Suspense fallback={<div className="results"><div className="center-wrap"><p>Loading…</p></div></div>}>
        <ResultsWithQuery {...resultsProps} />
      </Suspense>
    </main>
  );
}
