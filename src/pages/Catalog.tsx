import React, { useState } from "react";
import Course from "../components/Course/Course";
import SearchBar from "../components/SearchBar/SeachBar";
import DepartmentFilters from "../components/Department-Filters";

interface CatalogProps {
  toolboxCourses: { [key: string]: number };
  setToolboxCourses: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

interface CatalogProps{
  toolboxCourses: {[key: string]: number};
  Courses: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const Catalog: React.FC<CatalogProps> = ({ toolboxCourses, setToolboxCourses }) => {
  const [searchResults, updateSearchResults] = useState([]);
  const [hideCatalog, setHideCatalog] = useState(false);

  return (
    <>
      <img src="/carpi-black.png" alt="Carpi Logo" className="w-1/4 m-auto mt-5"/>
      <SearchBar updateSearchResults={updateSearchResults} onFocusChange={(focused => setHideCatalog(focused))}/>
      <div className="flex flex-wrap justify-center pb-38">
        <DepartmentFilters isVisible = {!hideCatalog}/>
        {searchResults?.map((course: any, index: number) => (
          <Course key={index} course={course} toolboxCourses={toolboxCourses} setToolboxCourses={setToolboxCourses} />
        ))}
      </div>
      
      <button className = "border-1 border-black rounded-full h-fit font-medium text-sm"> </button>
    </>
  );
};

export default Catalog;
