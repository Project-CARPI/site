import React from "react";
import { IoClose } from "react-icons/io5";
import { useFilterData } from "../../hooks/useFilters";
import { FilterData } from "../../types/Filters";

interface ChosenTagProp {
  filter: FilterData;
}

const ChosenTag: React.FC<ChosenTagProp> = ({ filter }) => {
  const { toggleFilter } = useFilterData();
  return (
    <div
      className={`rounded-2xl text-white px-3 py-1 text-sm mr-1 mb-1 font-thin bg-darkblue inline-flex items-center`}
    >
      {filter.code}
      <button
        type="button"
        onClick={() => toggleFilter(filter)}
        aria-label={`Remove filter: ${filter.code}`}
        className="inline ml-1"
      >
        <IoClose className="w-4 h-4 hover:cursor-pointer" />
      </button>
    </div>
  );
};

export default ChosenTag;
