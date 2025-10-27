import React from "react";
import { Filters } from "../../../types/Filters";

interface TagProp {
  id: number;
  code: string;
}

interface FilterSectionProps {
  sectionName: keyof Filters;
  tags: TagProp[];
  selected: string[];
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sectionName,
  tags,
  selected,
  updateFilters,
}) => {
  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-1">{sectionName}</h3>
      <div className="flex overflow-x-auto scrollbar-none">
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`rounded-2xl px-3 py-1 text-sm mr-1 mb-1 flex-none
              ${selected.includes(tag.code) ? "bg-darkblue text-carpipink font-thin" : "border border-darkblue text-darkblue"}`}
            onClick={() =>
              updateFilters((prev) => ({
                ...prev,
                [sectionName]: selected.includes(tag.code)
                  ? prev[sectionName].filter((code) => code !== tag.code)
                  : [...prev[sectionName], tag.code],
              }))
            }
          >
            {tag.code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
