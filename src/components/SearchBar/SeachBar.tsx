import React, { useState, useEffect, useRef, useMemo } from "react";
import { IoClose, IoSearchOutline, IoFilter } from "react-icons/io5";
import api from "../../axios";
import FilterPanel from "./FilterPanel/FilterPanel.tsx";
import ChosenTag from "./ChosenTag";
import { Filters, FilterData } from "../../types/Filters";
import DepartmentFilters from "../Department-Filters";
import { CourseType } from "../../types/interfaces/Course.interface.ts";
import useIsDesktop from "../../hooks/useIsDesktop.ts";
import FilterPanelPopup from "./FilterPanel/FilterPanelPopup.tsx";

interface SearchBarProps {
  updateSearchResults: (results: CourseType[]) => void;
  // Props for lifted state
  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  updateSearchResults,
  subjects,
  attributes,
  semesters,
}) => {
  const isDesktop = useIsDesktop();
  const componentRef = useRef<HTMLDivElement>(null);

  const [showDeptFilter, setShowDeptFilter] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [filters, setFilters] = useState<Filters>({
    Subject: [],
    Attributes: [],
    Semesters: [],
  });

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNoResultQuery = useRef<string | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const deptFilters = filters.Subject.join(",");
      const attrFilters = filters.Attributes.join(",");
      const semFilters = filters.Semesters.join(",");

      if (searchPrompt.length < 3) {
        lastNoResultQuery.current = null;
      }

      if (
        lastNoResultQuery.current &&
        searchPrompt.startsWith(lastNoResultQuery.current)
      ) {
        console.log("Skipping redundant no-result query");
        return;
      }

      try {
        const response = await api.get(
          "course/search?searchPrompt=" +
            searchPrompt +
            "&deptFilters=" +
            deptFilters +
            "&attrFilters=" +
            attrFilters +
            "&semFilters=" +
            semFilters
        );

        const data = response.data;
        updateSearchResults(data);

        if (data.length === 0 && searchPrompt.length >= 3) {
          lastNoResultQuery.current = searchPrompt;
        } else {
          lastNoResultQuery.current = null;
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters, searchPrompt, updateSearchResults]);

  const handleSearch = (e: React.KeyboardEvent) => {
    (e.currentTarget as HTMLInputElement).blur();
    setShowFilter(false);
    setShowDeptFilter(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(e.target.value);
    setShowFilter(false);
    if (e.target.value.length === 0) setShowDeptFilter(true);
  };

  const updateFilters = (category: keyof Filters, value: string) => {
    if (showDeptFilter) {
      setShowDeptFilter(false);
      window.scrollTo(0, 0);
    }

    setFilters((prev) => {
      if (prev[category].includes(value)) {
        const newFilters: Filters = { ...prev };
        newFilters[category] = newFilters[category].filter(
          (tag) => tag !== value
        );
        return newFilters;
      }
      return {
        ...prev,
        [category]: [...prev[category], value],
      };
    });
  };

  const removeFilter = (value: string) => {
    setFilters((prev) => {
      const newFilters: Filters = { ...prev };
      for (const category of Object.keys(prev) as (keyof Filters)[]) {
        newFilters[category] = newFilters[category].filter(
          (tag) => tag !== value
        );
      }

      if (
        newFilters.Subject.length === 0 &&
        newFilters.Attributes.length === 0 &&
        newFilters.Semesters.length === 0
      ) {
        setShowDeptFilter(true);
        setShowFilter(false);
      }
      return newFilters;
    });
  };

  const allActiveFilters = useMemo(() => {
    return Object.values(filters).flat();
  }, [filters]);

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
            filters={filters}
            updateFilters={updateFilters}
            subjects={subjects}
            attributes={attributes}
            semesters={semesters}
          />
        )}
      </div>

      <div className="flex flex-wrap w-full items-start ">
        {allActiveFilters.map((tag) => (
          <ChosenTag key={tag} name={tag} onRemove={removeFilter} />
        ))}
      </div>

      {showFilter && !isDesktop && (
        <FilterPanel
          filters={filters}
          updateFilters={updateFilters}
          subjects={subjects}
          attributes={attributes}
          semesters={semesters}
        />
      )}

      {showDeptFilter && (
        <div className="md:h-[calc(100vh-17rem)] mt-2">
          <DepartmentFilters updateFilters={updateFilters} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
