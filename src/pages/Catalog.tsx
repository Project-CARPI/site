import React from "react";
import Course from "../components/Course/Course";
import SearchBar from "../components/SearchBar/SeachBar";
import {
  CourseType,
  CourseEntry,
} from "../types/interfaces/Course.interface.ts";
import { Filters } from "../types/Filters";

interface CatalogProps {
  toolboxCourses: CourseEntry[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<CourseEntry[]>>;
  isDragging: boolean;
  // New props added from the moved state
  searchResults: CourseType[];
  setSearchResults: React.Dispatch<React.SetStateAction<CourseType[]>>;
  searchPrompt: string;
  setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const Catalog: React.FC<CatalogProps> = ({
  toolboxCourses,
  setToolboxCourses,
  searchResults,
  setSearchResults,
  searchPrompt,
  setSearchPrompt,
  showFilter,
  setShowFilter,
  filters,
  setFilters,
}) => {
  return (
    <section className="flex flex-col gap-4">
      <div className={`sticky top-20 z-10`}>
        <h1 className="font-bold text-xl">Courses</h1>
        <SearchBar
          updateSearchResults={setSearchResults}
          searchPrompt={searchPrompt}
          setSearchPrompt={setSearchPrompt}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="md:h-[calc(100vh-17rem)] md:overflow-hidden">
          <div className="h-full overflow-y-auto flex flex-wrap justify-center gap-4 pr-4">
            {searchResults?.map((course: CourseType, index: number) => (
              <Course
                key={index}
                course={course}
                toolboxCourses={toolboxCourses}
                setToolboxCourses={setToolboxCourses}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalog;
