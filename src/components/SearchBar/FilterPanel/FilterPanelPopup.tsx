import { Filters, FilterData } from "../../../types/Filters";
import FilterPanel from "./FilterPanel";

interface FilterPanelPopupProps {
  filters: { [key: string]: string[] };
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;

  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const FilterPanelPopup: React.FC<FilterPanelPopupProps> = ({
  filters,
  updateFilters,
  subjects,
  attributes,
  semesters,
}) => {
  return (
    <div className="absolute right-4 top-20 z-10 mt-2 w-full max-w-sm rounded-lg bg-carpipink p-4 shadow-lg border border-darkblue">
      <FilterPanel
        filters={filters}
        updateFilters={updateFilters}
        subjects={subjects}
        attributes={attributes}
        semesters={semesters}
      />
    </div>
  );
};

export default FilterPanelPopup;
