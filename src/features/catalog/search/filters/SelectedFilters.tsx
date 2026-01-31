import { useCatalog } from "@/features/catalog/search/context/useCatalog";
import Tag from "@/features/catalog/Tag";

export default function SelectedFilters() {
  const { selectedFilters } = useCatalog();

  if (selectedFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap w-full items-start gap-1 max-h-30 overflow-y-auto">
      {selectedFilters.map((filter) => (
        <Tag
          key={`${filter.type}-${filter.code}`}
          filter={filter}
          isRemovable={true}
        />
      ))}
    </div>
  );
}
