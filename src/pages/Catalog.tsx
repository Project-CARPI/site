import React, { useState } from "react";
import Course from "../components/Course/Course";
import SearchBar from "../components/SearchBar/SeachBar";
import {
  CourseType,
  CourseEntry,
} from "../types/interfaces/Course.interface.ts";

interface CatalogProps {
  toolboxCourses: CourseEntry[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<CourseEntry[]>>;
  isDragging: boolean;
}

const Catalog: React.FC<CatalogProps> = ({
  toolboxCourses,
  setToolboxCourses,
  isDragging,
}) => {
  const [searchResults, updateSearchResults] = useState([]);

  return (
    <>
      <img
        src="/carpi-black.png"
        alt="Carpi Logo"
        className="w-1/4 m-auto pt-5"
      />
      <div className={`${isDragging ? "brightness-50" : ""}`}>
        <SearchBar updateSearchResults={updateSearchResults} />
      </div>
      <div
        className={`flex flex-wrap justify-center pb-38 z-0 relative ${isDragging ? "brightness-50" : ""}`}
      >
        {searchResults?.map((course: CourseType, index: number) => (
          <Course
            key={index}
            course={course}
            toolboxCourses={toolboxCourses}
            setToolboxCourses={setToolboxCourses}
          />
        ))}
      </div>
    </>
  );
};

export default Catalog;
