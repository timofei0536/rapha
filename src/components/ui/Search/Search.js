import "./Search.scss";
import SearchIcon from "@/components/ui/icons/Search";

export default function Search() {
  return (
    <form className="search" action="/results" method="get" role="search">
      <SearchIcon className="search__icon" aria-hidden />
      <input
        type="search"
        name="q"
        className="search__input"
        placeholder="Search"
        aria-label="Search"
      />
    </form>
  );
}
