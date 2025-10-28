import { useFilterData } from "../../../hooks/useFilters";
import FilterSection from "./FilterSection";

const FilterPanel: React.FC = () => {
  const { selectedFilters, toggleFilter, subjects, attributes, semesters } =
    useFilterData();

  const selectedSubjects = selectedFilters
    .filter((f) => f.type === "Subject")
    .map((f) => f.code);
  const selectedAttributes = selectedFilters
    .filter((f) => f.type === "Attributes")
    .map((f) => f.code);
  const selectedSemesters = selectedFilters
    .filter((f) => f.type === "Semesters")
    .map((f) => f.code);

  return (
    <div className="w-full">
      <FilterSection
        sectionName="Subject"
        tags={subjects}
        selected={selectedSubjects}
        toggleFilter={toggleFilter}
      />
      <FilterSection
        sectionName="Attributes"
        tags={attributes}
        selected={selectedAttributes}
        toggleFilter={toggleFilter}
      />
      <FilterSection
        sectionName="Semesters"
        tags={semesters}
        selected={selectedSemesters}
        toggleFilter={toggleFilter}
      />
    </div>
  );
};

export default FilterPanel;
