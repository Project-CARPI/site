import React from "react";
import { useFilterData } from "../hooks/useFilters";

const DepartmentFilters: React.FC = () => {
  const { toggleFilter, subjects } = useFilterData();

  return (
    <div className="md:h-full md:w-full md:overflow-y-auto flex flex-wrap justify-center gap-1">
      {subjects.map((subject) => (
        <button
          key={subject.code}
          className={`
            px-3 
            py-2 
            rounded-full
            border 
            border-darkblue 
            text-xs
            transition-colors
            hover:bg-darkblue hover:text-carpipink hover:cursor-pointer
            h-fit
          `}
          onClick={() => toggleFilter(subject)}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold">{subject.code}</span>
            <span className="font-normal">{subject.value}</span>
          </div>
        </button>
      ))}

      <div className="h-15" />
    </div>
  );
};

export default DepartmentFilters;
