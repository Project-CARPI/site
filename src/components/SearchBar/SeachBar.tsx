import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoSearchOutline, IoFilter } from "react-icons/io5";
import FilterPanel from "./FilterPanel/FilterPanel.tsx";
import { Filters, FilterData } from "../../types/Filters";
import useIsDesktop from "../../hooks/useIsDesktop.ts";
import FilterPanelPopup from "./FilterPanel/FilterPanelPopup.tsx";

interface SearchBarProps {
  setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  selectedFilters: { [key: string]: string[] };
  searchPrompt: string;
  // Props for lifted state
  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  setSearchPrompt,
  setFilters,
  selectedFilters,
  searchPrompt,
  subjects,
  attributes,
  semesters,
}) => {
  const isDesktop = useIsDesktop();
  const componentRef = useRef<HTMLDivElement>(null);

  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (e: React.KeyboardEvent) => {
    (e.currentTarget as HTMLInputElement).blur();
    setShowFilter(false);
  };

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
    <div className="flex justify-between flex-col items-center gap-2">
      <div
        ref={componentRef}
        className="flex items-center gap-4 w-full border-b boarder-darkblue p-2"
      >
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
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Done") handleSearch(e);
          }}
        />

        {showFilter ? (
          <IoClose
            onClick={() => {
              setShowFilter(false); // Uses prop
              setSearchPrompt(""); // Uses prop
            }}
            className="w-5 h-5"
          />
        ) : (
          <IoFilter
            onClick={() => {
              setShowFilter(true); // Uses prop
            }}
            className="w-5 h-5"
          />
        )}

        {showFilter && isDesktop && (
          <FilterPanelPopup
            filters={selectedFilters}
            updateFilters={setFilters}
            subjects={subjects}
            attributes={attributes}
            semesters={semesters}
          />
        )}
      </div>

      {showFilter && !isDesktop && (
        <FilterPanel
          filters={selectedFilters}
          updateFilters={setFilters}
          subjects={subjects}
          attributes={attributes}
          semesters={semesters}
        />
      )}
    </div>
  );
};

export default SearchBar;
