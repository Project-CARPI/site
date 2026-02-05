import FilterPanel from "@/features/catalog/search/filters/FilterPanel";

export default function FilterPopup() {
  return (
    <div className="absolute right-0 top-16 z-10 mt-2 w-full max-w-sm rounded-lg bg-darkblue text-carpipink p-4 shadow-lg ">
      <FilterPanel />
    </div>
  );
}
