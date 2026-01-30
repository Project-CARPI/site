import { useCatalog } from "@/features/catalog/search/context/context";

export default function DepartmentFilters() {
  const { toggleFilter, filters } = useCatalog();

  return (
    <div className="md:overflow-y-auto flex flex-wrap justify-center gap-1">
      {filters.subjects.map((subject) => (
        <button
          key={subject.code}
          className={`
            px-3 
            py-2 
            rounded-full
            border 
            border-darkblue 
            text-xs
            transition-colors
            hover:bg-darkblue hover:text-carpipink hover:cursor-pointer
            h-fit
          `}
          onClick={() => toggleFilter(subject)}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold">{subject.code}</span>
            <span className="font-normal">{subject.value}</span>
          </div>
        </button>
      ))}

      <div className="h-40" />
    </div>
  );
}
