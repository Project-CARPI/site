import React from "react";
import { IoClose } from "react-icons/io5";
import { useFilterData } from "../../hooks/useFilters";
import { FilterData } from "../../types/interfaces/Filters.interface";

interface ChosenTagProp {
  filter: FilterData;
}

const getColorClass = (type: string) => {
  switch (type) {
    case "Subject":
      return "bg-burgundy text-carpipink hover:bg-[color-mix(in_oklab,var(--color-burgundy)_80%,black_20%)]";
    case "Attribute":
      return "bg-slategray text-carpipink hover:bg-[color-mix(in_oklab,var(--color-slategray)_80%,black_20%)]";
    case "Semester":
      return "bg-copperwood text-carpipink hover:bg-[color-mix(in_oklab,var(--color-copperwood)_80%,black_20%)]";
    default:
      return "";
  }
};

const ChosenTag: React.FC<ChosenTagProp> = ({ filter }) => {
  const { toggleFilter } = useFilterData();
  return (
    <div
      className={`${getColorClass(filter.type)} rounded-2xl px-3 py-1 text-sm mr-1 mb-1 inline-flex items-center`}
    >
      {filter.value}
      <button
        type="button"
        onClick={() => toggleFilter(filter)}
        aria-label={`Remove filter: ${filter.value}`}
        className="inline ml-1"
      >
        <IoClose className="w-4 h-4 hover:cursor-pointer" />
      </button>
    </div>
  );
};

export default ChosenTag;
