import { Filters } from "../../../types/Filters";
import FilterPanel from "./FilterPanel";

interface FilterPanelPopupProps {
  filters: { [key: string]: string[] };
  updateFilters: (category: keyof Filters, value: string) => void;
  setShowFilter: (show: boolean) => void;
}

const FilterPanelPopup: React.FC<FilterPanelPopupProps> = ({
  filters,
  updateFilters,
}) => {
  return (
    <div className="absolute right-4 top-20 z-10 mt-2 w-full max-w-sm rounded-lg bg-carpipink p-4 shadow-lg border border-darkblue">
      <FilterPanel filters={filters} updateFilters={updateFilters} />
    </div>
  );
};

export default FilterPanelPopup;
