import React, { useState, useEffect, useRef } from "react";
import api from "../axios.ts";
import Course from "../components/Course/CatalogCourse.tsx";
import SearchBar from "../components/SearchBar/SeachBar";
import { Filters, FilterData } from "../types/Filters";
import { CourseType } from "../types/interfaces/Course.interface.ts";
import DepartmentFilters from "../components/Department-Filters.tsx";

interface CatalogProps {
  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const Catalog: React.FC<CatalogProps> = ({
  subjects,
  attributes,
  semesters,
}) => {
  const [searchResults, setSearchResults] = React.useState<CourseType[]>([]);
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
        setSearchResults(data);

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
  }, [filters, searchPrompt, setSearchResults]);

  return (
    <section className="flex flex-col gap-4">
      <div className={`sticky top-20 z-10`}>
        <h1 className="font-bold text-xl">Courses</h1>
        <SearchBar
          setSearchPrompt={setSearchPrompt}
          setFilters={setFilters}
          selectedFilters={filters}
          searchPrompt={searchPrompt}
          subjects={subjects}
          attributes={attributes}
          semesters={semesters}
        />
      </div>

      {searchResults.length > 0 ? (
        <div className="md:h-[calc(100vh-17rem)] md:overflow-hidden">
          <div className="h-full overflow-y-auto flex flex-wrap justify-center gap-4 pr-4">
            {searchResults?.map((course: CourseType, index: number) => (
              <Course key={index} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="md:h-[calc(100vh-17rem)] mt-2">
          <DepartmentFilters updateFilters={setFilters} />
        </div>
      )}
    </section>
  );
};

export default Catalog;
