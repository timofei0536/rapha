import Results from "@/components/Results/Results";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Search Results",
};

export default async function ResultsPage({ searchParams }) {
  const resultsProps = await getBlockPropsForPage("results", "results", searchParams);

  return (
    <main>
      <Results {...resultsProps} />
    </main>
  );
}
