import FilterPanel from "./FilterPanel";

const FilterPanelPopup: React.FC = () => {
  return (
    <div className="absolute right-4 top-20 z-10 mt-2 w-full max-w-sm rounded-lg bg-carpipink p-4 shadow-lg border border-darkblue">
      <FilterPanel />
    </div>
  );
};

export default FilterPanelPopup;
