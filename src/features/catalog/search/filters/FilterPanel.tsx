import { useCatalog } from "@/features/catalog/search/context/useCatalog";
import FilterSection from "@/features/catalog/search/filters/FilterSection";

export default function FilterPanel() {
  const { filters } = useCatalog();

  return (
    <div className="md:max-h-80 md:overflow-y-auto scrollbar-thin scrollbar-thumb-carpipink scrollbar-track-darkblue/50">
      <h1 className="font-bold">Filter By</h1>
      <FilterSection sectionName="Subject" tags={filters.subjects} showCode />
      <FilterSection sectionName="Attribute" tags={filters.attributes} />
      <FilterSection sectionName="Semester" tags={filters.semesters} />
      <div className="h-20 md:h-5" />
    </div>
  );
}
