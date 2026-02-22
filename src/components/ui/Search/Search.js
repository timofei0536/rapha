"use client";

import { useRef } from "react";
import "./Search.scss";
import SearchIcon from "@/components/ui/icons/Search";

export default function Search() {
  const inputRef = useRef(null);

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
        placeholder="Search"
        aria-label="Search"
      />
    </form>
  );
}
