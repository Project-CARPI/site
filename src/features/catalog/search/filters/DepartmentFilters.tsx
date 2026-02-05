import { useCatalog } from "@/features/catalog/search/context/useCatalog";
import { cn } from "@/lib/classnames";

export default function DepartmentFilters() {
  const { toggleFilter, filters, selectedFilters } = useCatalog();

  return (
    <div className="md:overflow-y-auto flex flex-wrap justify-center gap-1 mt-2">
      {filters.subjects.map((subject) => {
        const isSelected = selectedFilters.some(
          (sf) => sf.code === subject.code && sf.type === subject.type,
        );

        return (
          <button
            key={subject.code}
            className={cn(
              "px-3 py-2 rounded-full border text-xs transition-colors h-fit",
              isSelected
                ? "bg-darkblue text-carpipink border-darkblue"
                : "bg-transparent text-darkblue border-darkblue hover:bg-darkblue/10",
            )}
            onClick={() => toggleFilter(subject)}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold">{subject.code}</span>
              <span className="font-normal">{subject.value}</span>
            </div>
          </button>
        );
      })}

      <div className="h-40" />
    </div>
  );
}
