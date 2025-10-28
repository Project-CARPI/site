import React, { useState, useRef, useEffect } from "react";
import api from "../axios.ts";
import Course from "../components/Course/CatalogCourse.tsx";
import SearchBar from "../components/SearchBar/SeachBar";
import { CourseType } from "../types/interfaces/Course.interface.ts";
import DepartmentFilters from "../components/Department-Filters.tsx";
import ChosenTag from "../components/SearchBar/ChosenTag";
import { useFilterData } from "../hooks/useFilters.ts";

const Catalog: React.FC = () => {
  const { selectedFilters } = useFilterData();

  const [searchResults, setSearchResults] = React.useState<CourseType[]>([]);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNoResultQuery = useRef<string | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchPrompt.length === 0 && selectedFilters.length === 0) {
      setHasSearched(false);
      setSearchResults([]);
      setIsLoading(false);
      lastNoResultQuery.current = null;
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    debounceTimeout.current = setTimeout(async () => {
      const deptFilters = selectedFilters
        .filter((filter) => filter.type === "Subject")
        .map((filter) => filter.code);
      const attrFilters = selectedFilters
        .filter((filter) => filter.type === "Attributes")
        .map((filter) => filter.code);
      const semFilters = selectedFilters
        .filter((filter) => filter.type === "Semesters")
        .map((filter) => filter.code);

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
        setSearchResults(data);
        setIsLoading(false);

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
  }, [selectedFilters, searchPrompt, setSearchResults]);

  return (
    <section className="flex flex-col gap-2">
      <div className={`sticky top-20 z-10 flex flex-col gap-2`}>
        <h1 className="font-bold text-xl">Courses</h1>
        <SearchBar
          setSearchPrompt={setSearchPrompt}
          searchPrompt={searchPrompt}
        />

        <div className="flex flex-wrap w-full items-start ">
          {selectedFilters.map((filter) => (
            <ChosenTag key={filter.id} filter={filter} />
          ))}
        </div>
      </div>

      <div className="md:h-[calc(100vh-17rem)] md:overflow-hidden">
        {searchResults.length > 0 ? (
          <div className="h-full overflow-y-auto flex flex-wrap justify-center gap-4 pr-3 pt-3">
            {searchResults?.map((course: CourseType, index: number) => (
              <Course key={index} course={course} />
            ))}

            <div className="h-15" />
          </div>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 animate-pulse h-fit border-1 border-darkblue/20 rounded-xl p-4 flex items-center gap-2 justify-between"
            >
              <div className="flex gap-2 flex-col justify-between">
                <div className="h-5 w-25 bg-darkblue/20 rounded-sm"></div>
                <div className="h-5 w-50 bg-darkblue/20 rounded-sm"></div>

                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-6 w-15 bg-darkblue/20 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="h-15 w-15 bg-darkblue/20 rounded-full"></div>
            </div>
          ))
        ) : hasSearched ? (
          <div>No results found.</div>
        ) : (
          selectedFilters.length === 0 && <DepartmentFilters />
        )}
      </div>
    </section>
  );
};

export default Catalog;
