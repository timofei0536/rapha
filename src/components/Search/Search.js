import "./Search.scss";
import SearchIcon from "@/components/icons/Search";

export default function Search() {
  return (
    <div className="search">
      <SearchIcon className="search__icon" aria-hidden />
      <input
        type="text"
        className="search__input"
        placeholder="Search"
        aria-label="Search"
      />
    </div>
  );
}
