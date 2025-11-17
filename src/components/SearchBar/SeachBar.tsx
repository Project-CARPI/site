import React, { useEffect, useRef } from "react";
import { IoClose, IoSearchOutline, IoFilter } from "react-icons/io5";
import FilterPanel from "./FilterPanel/FilterPanel.tsx";
import useIsDesktop from "../../hooks/useIsDesktop.ts";
import FilterPanelPopup from "./FilterPanel/FilterPanelPopup.tsx";
import ChosenTag from "./ChosenTag.tsx";
import { useFilterData } from "../../hooks/useFilters.ts";

interface SearchBarProps {
  searchPrompt: string;
  setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchPrompt,
  setSearchPrompt,
  showFilter,
  setShowFilter,
}) => {
  const { selectedFilters } = useFilterData();
  const isDesktop = useIsDesktop();
  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(e.target.value);
    setShowFilter(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={componentRef}
      className="flex justify-between flex-col items-center gap-2"
    >
      <div className="flex items-center gap-4 w-full border-b border-darkblue p-2">
        <IoSearchOutline className="w-5 h-5" />
        <input
          type="text"
          aria-label="Search Courses"
          aria-required="true"
          placeholder="Find Courses Here"
          className="flex-grow text-base placeholder-darkblue-40 focus:placeholder-transparent focus:outline-none focus:ring-0"
          value={searchPrompt}
          enterKeyHint="search"
          onClick={() => setShowFilter(false)}
          onChange={handleInputChange}
        />

        {showFilter ? (
          <IoClose
            onClick={() => {
              setShowFilter(false); // Uses prop
              setSearchPrompt(""); // Uses prop
            }}
            className="w-5 h-5 hover:cursor-pointer"
          />
        ) : (
          <IoFilter
            onClick={() => {
              setShowFilter(true); // Uses prop
            }}
            className="w-5 h-5 hover:cursor-pointer"
          />
        )}

        {showFilter && isDesktop && <FilterPanelPopup />}
      </div>

      {!isDesktop && (
        <div className="flex flex-wrap w-full items-start ">
          {selectedFilters.map((filter) => (
            <ChosenTag key={filter.id} filter={filter} />
          ))}
        </div>
      )}
      {showFilter && !isDesktop && <FilterPanel />}
    </div>
  );
};

export default SearchBar;
