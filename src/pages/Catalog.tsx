import React from "react";
import Course from "../components/Course/Course";
import SearchBar from "../components/SearchBar/SeachBar";
import { CourseType } from "../types/interfaces/Course.interface.ts";
import { FilterData } from "../types/Filters";

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

  return (
    <section className="flex flex-col gap-4">
      <div className={`sticky top-20 z-10`}>
        <h1 className="font-bold text-xl">Courses</h1>
        <SearchBar
          updateSearchResults={setSearchResults}
          subjects={subjects}
          attributes={attributes}
          semesters={semesters}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="md:h-[calc(100vh-17rem)] md:overflow-hidden">
          <div className="h-full overflow-y-auto w-2/3 flex flex-wrap justify-center gap-4 pr-4">
            {searchResults?.map((course: CourseType, index: number) => (
              <Course key={index} course={course} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalog;
