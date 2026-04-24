import { useEffect, useRef } from "react";

import { IoClose, IoSearchOutline, IoFilter } from "react-icons/io5";

import { useCatalog } from "@/features/catalog/search/context/useCatalog";
import FilterPanel from "@/features/catalog/search/filters/FilterPanel";
import FilterPanelPopup from "@/features/catalog/search/filters/FilterPopup";
import SelectedFilters from "@/features/catalog/search/filters/SelectedFilters";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

export default function SearchBar() {
  const isDesktop = useIsDesktop();
  const { searchPrompt, setSearchPrompt, showFilterPanel, setShowFilterPanel } =
    useCatalog();

  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(e.target.value);
    setShowFilterPanel(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFilterPanel]);

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
          onClick={() => setShowFilterPanel(false)}
          onChange={handleInputChange}
        />

        {showFilterPanel ? (
          <IoClose
            onClick={() => {
              setShowFilterPanel(false); // Uses prop
              setSearchPrompt(""); // Uses prop
            }}
            className="w-5 h-5 hover:cursor-pointer"
          />
        ) : (
          <IoFilter
            onClick={() => {
              setShowFilterPanel(true); // Uses prop
            }}
            className="w-5 h-5 hover:cursor-pointer"
          />
        )}

        {showFilterPanel && isDesktop && <FilterPanelPopup />}
      </div>
      {!isDesktop && <SelectedFilters />}
      {showFilterPanel && !isDesktop && <FilterPanel />}
    </div>
  );
}
