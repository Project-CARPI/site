import React, { useState } from "react";
import { FilterData } from "../../../types/interfaces/Filters.interface";

interface FilterSectionProps {
  sectionName: "Subject" | "Attributes" | "Semesters";
  tags: FilterData[];
  selected: string[];
  toggleFilter: (filter: FilterData) => void;
}

const FilterSectionChild: React.FC<FilterSectionProps> = ({
  sectionName,
  tags,
  selected,
  toggleFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <h3
        className="font-semibold mb-1 hover:cursor-pointer hover:bg-carpipink/10 rounded-full px-4"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {sectionName}
      </h3>

      {isExpanded && (
        <div className="absolute left-full top-0 z-10 p-2 ml-2 bg-darkblue text-carpipink shadow-lg border rounded-2xl border-darkblue flex flex-wrap w-xl">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`hover:bg-darkblue/10 hover:cursor-pointer rounded-2xl px-3 py-1 text-sm mr-1 mb-1 flex-none transition-colors
                ${
                  selected.includes(tag.code)
                    ? "bg-darkblue text-carpipink hover:bg-darkblue/70 border border-carpipink"
                    : "border border-carpipink"
                }`}
              onClick={() => toggleFilter(tag)}
            >
              {tag.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSectionChild;
