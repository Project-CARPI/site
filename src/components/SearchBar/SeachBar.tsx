import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import api from "../../axios";
import FilterPanel from "./FilterPanel";
import ChosenTag from "./ChosenTag";
import { Filters } from "../../types/Filters";
import DepartmentFilters from "../Department-Filters";
import { CourseType } from "../../types/interfaces/Course.interface.ts";

interface SearchBarProps {
  updateSearchResults: (results: CourseType[]) => void;
  // New props for state lifted to App.tsx
  searchPrompt: string;
  setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ updateSearchResults }) => {
  const [showDeptFilter, setShowDeptFilter] = useState(true);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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
    }, 300); // Change this delay if you want

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters, searchPrompt]);

  const handleSearch = (e: React.KeyboardEvent) => {
    (e.currentTarget as HTMLInputElement).blur();
    setShowFilter(false);
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

  return (
    <div className="p-4 pt-0 pb-0 w-full">
      <div className="flex justify-between items-center border-b p-2 m-2">
        <div className="flex items-center gap-2 w-full">
          <IoSearchOutline />
          <input
            type="text"
            aria-label="Search Courses"
            aria-required="true"
            placeholder="Find Courses Here"
            className="flex-grow text-base placeholder-darkblue-40 focus:placeholder-transparent focus:outline-none focus:ring-0"
            value={searchPrompt}
            enterKeyHint="search"
            onClick={() => setShowFilter(true)}
            onChange={(e) => setSearchPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Done") handleSearch(e);
            }}
          />
        </div>
        {showFilter && (
          <IoClose
            onClick={() => {
              setShowFilter(false);
              setSearchPrompt("");
            }}
          />
        )}
      </div>

      <div className="flex items-start -mb-2">
        <div className="flex flex-wrap w-full">
          {filters.Subject.map((tag, index) => (
            <ChosenTag key={index} name={tag} onRemove={removeFilter} />
          ))}
          {filters.Attributes.map((tag, index) => (
            <ChosenTag key={index} name={tag} onRemove={removeFilter} />
          ))}
          {filters.Semesters.map((tag, index) => (
            <ChosenTag key={index} name={tag} onRemove={removeFilter} />
          ))}
        </div>

        <button
          className="unset w-[150px] text-right text-sm cursor-pointer mr-2"
          onClick={() => {
            setShowFilter((prev) => {
              const newValue = !prev;
              return newValue;
            });
          }}
        >
          {showFilter ? "Hide Options" : "Show Options"}
        </button>
      </div>

      {showFilter && (
        <FilterPanel filters={filters} updateFilters={updateFilters} />
      )}

      {showDeptFilter && (
        <div className="md:h-[calc(100vh-17rem)] mt-4">
          <DepartmentFilters updateFilters={updateFilters} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
