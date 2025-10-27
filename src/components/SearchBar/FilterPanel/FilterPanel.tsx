import { Filters, FilterData } from "../../../types/Filters";
import FilterSection from "./FilterSection";

interface FilterPanelProps {
  filters: { [key: string]: string[] };
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;

  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  updateFilters,
  subjects,
  attributes,
  semesters,
}) => {
  return (
    <div className="w-full">
      <FilterSection
        sectionName="Subject"
        tags={subjects}
        selected={filters.Subject}
        updateFilters={updateFilters}
      />
      <FilterSection
        sectionName="Attributes"
        tags={attributes}
        selected={filters.Attributes}
        updateFilters={updateFilters}
      />
      <FilterSection
        sectionName="Semesters"
        tags={semesters}
        selected={filters.Semesters}
        updateFilters={updateFilters}
      />
    </div>
  );
};

export default FilterPanel;
