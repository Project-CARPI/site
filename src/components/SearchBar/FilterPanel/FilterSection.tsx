import React from "react";
import { FilterData } from "../../../types/interfaces/Filters.interface";

interface FilterSectionProps {
  sectionName: "Subject" | "Attributes" | "Semesters";
  tags: FilterData[];
  selected: string[];
  toggleFilter: (filter: FilterData) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sectionName,
  tags,
  selected,
  toggleFilter,
}) => {
  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-1">{sectionName}</h3>
      <div className="flex overflow-x-auto scrollbar-none">
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`hover:bg-darkblue/10 hover:cursor-pointer rounded-2xl px-3 py-1 text-sm mr-1 mb-1 flex-none
              ${selected.includes(tag.code) ? "bg-darkblue text-carpipink hover:bg-darkblue/70 border border-darkblue" : "border border-darkblue text-darkblue"}`}
            onClick={() => toggleFilter(tag)}
          >
            {tag.value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
