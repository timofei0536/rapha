"use client";

import { Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "./Search.scss";
import SearchIcon from "@/components/ui/icons/Search";
import { useGeneral } from "@/context/GeneralContext";

function SearchForm() {
  const inputRef = useRef(null);
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const { search: searchLabel } = useGeneral();

  return (
    <form
      className="search"
      action="/results"
      method="get"
      role="search"
      onClick={(e) => {
        if (e.target.closest(".search__input") === null) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      <SearchIcon className="search__icon" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        name="q"
        className="search__input"
        placeholder={searchLabel ?? "Search"}
        aria-label={searchLabel ?? "Search"}
        defaultValue={queryFromUrl}
      />
    </form>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div className="search" aria-hidden />}>
      <SearchForm />
    </Suspense>
  );
}
