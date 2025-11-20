import React from "react";
import FilterPanel from "./FilterPanel";

const FilterPanelPopup: React.FC = () => {
  return (
    <div className="absolute right-0 top-16 z-10 mt-2 w-full max-w-sm rounded-lg bg-dustygrape text-carpipink p-4 shadow-lg ">
      <FilterPanel />
    </div>
  );
};

export default FilterPanelPopup;
