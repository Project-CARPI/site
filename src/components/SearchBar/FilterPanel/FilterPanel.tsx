import { useFilterData } from "../../../hooks/useFilters";
import FilterSection from "./FilterSection";
// import FilterSectionChild from "./FilterSectionChild";

const FilterPanel: React.FC = () => {
  const { selectedFilters, toggleFilter, subjects, attributes, semesters } =
    useFilterData();

  const selectedSubjects = selectedFilters
    .filter((f) => f.type === "Subject")
    .map((f) => f.code);
  const selectedAttributes = selectedFilters
    .filter((f) => f.type === "Attribute")
    .map((f) => f.code);
  const selectedSemesters = selectedFilters
    .filter((f) => f.type === "Semester")
    .map((f) => f.code);

  return (
    <div className="md:max-h-96 md:overflow-y-auto scrollbar-thin scrollbar-thumb-darkblue scrollbar-track-dustygrape/50">
      <h1 className="font-bold">Filter By</h1>
      <FilterSection
        sectionName="Subject"
        tags={subjects}
        selected={selectedSubjects}
        toggleFilter={toggleFilter}
        showCode
        classname="bg-[#721121] text-carpipink hover:bg-[color-mix(in_oklab,#721121_80%,black_20%)]"
      />
      <FilterSection
        sectionName="Attribute"
        tags={attributes}
        selected={selectedAttributes}
        toggleFilter={toggleFilter}
        classname="bg-[#99C1B9] text-darkblue hover:bg-[color-mix(in_oklab,#99C1B9_80%,black_20%)]"
      />
      <FilterSection
        sectionName="Semester"
        tags={semesters}
        selected={selectedSemesters}
        toggleFilter={toggleFilter}
        classname="bg-[#565E87] text-carpipink hover:bg-[color-mix(in_oklab,#565E87_80%,black_20%)]"
      />
    </div>
  );
};

export default FilterPanel;
