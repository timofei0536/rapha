"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Results from "./Results";
import { getSearchResults } from "@/lib/search";

export default function ResultsWithQuery(serverProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? searchParams.get("query") ?? "";
  const queryFromUrl = typeof q === "string" ? q.trim() : "";

  const [clientState, setClientState] = useState({ query: null, items: null });

  useEffect(() => {
    if (!queryFromUrl) {
      setClientState({ query: null, items: null });
      return;
    }
    let cancelled = false;
    getSearchResults(queryFromUrl).then((items) => {
      if (!cancelled) setClientState({ query: queryFromUrl, items });
    });
    return () => { cancelled = true; };
  }, [queryFromUrl]);

  const query = clientState.query !== null ? clientState.query : (serverProps.query || "");
  const items = clientState.items !== null ? clientState.items : (serverProps.items || []);

  return <Results {...serverProps} query={query} items={items} />;
}
