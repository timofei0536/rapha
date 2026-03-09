import { Suspense } from "react";
import ResultsWithQuery from "@/components/Results/ResultsWithQuery";
import { getBlockPropsForPage } from "@/lib/rapha";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Results",
};

export default async function ResultsPage() {
  const resultsProps = await getBlockPropsForPage("results", "results", {});

  return (
    <main>
      <Suspense fallback={<div className="results"><div className="center-wrap"><p>Loading…</p></div></div>}>
        <ResultsWithQuery {...resultsProps} />
      </Suspense>
    </main>
  );
}
