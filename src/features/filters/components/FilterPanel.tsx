import FilterSection from "@/features/filters/components/FilterSection";
import { useFilterData } from "@/features/filters/useFilterData";

export default function FilterPanel() {
  const { selectedFilters, subjects, attributes, semesters } = useFilterData();

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
    <div className="md:max-h-80 md:overflow-y-auto scrollbar-thin scrollbar-thumb-carpipink scrollbar-track-darkblue/50">
      <h1 className="font-bold">Filter By</h1>
      <FilterSection
        sectionName="Subject"
        tags={subjects}
        selected={selectedSubjects}
        showCode
      />
      <FilterSection
        sectionName="Attribute"
        tags={attributes}
        selected={selectedAttributes}
      />
      <FilterSection
        sectionName="Semester"
        tags={semesters}
        selected={selectedSemesters}
      />
      <div className="h-20 md:h-5" />
    </div>
  );
}
