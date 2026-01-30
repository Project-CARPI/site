import { useCatalog } from "@/features/catalog/search/context/context";
import FilterSection from "@/features/catalog/search/filters/FilterSection";

export default function FilterPanel() {
  const { selectedFilters, filters } = useCatalog();

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
        tags={filters.subjects}
        selected={selectedSubjects}
        showCode
      />
      <FilterSection
        sectionName="Attribute"
        tags={filters.attributes}
        selected={selectedAttributes}
      />
      <FilterSection
        sectionName="Semester"
        tags={filters.semesters}
        selected={selectedSemesters}
      />
      <div className="h-20 md:h-5" />
    </div>
  );
}
