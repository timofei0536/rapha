import Results from "@/components/Results/Results";
import { ResultsDefaults } from "@/components/Results/defaults";

export const metadata = {
  title: "Search Results",
};

export default function ResultsPage() {
    return (
        <main>
            <Results {...ResultsDefaults} />
        </main>
    );
}
