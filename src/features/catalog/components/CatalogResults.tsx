import DepartmentFilters from "@/features/catalog/DepartmentFilters";
import { FilterData } from "@/features/catalog/search/filters/types";
import Course from "@/features/course/components/CatalogCourse";
import { APICourse } from "@/features/course/interfaces";

export default function CatalogResults({
  searchResults,
  isLoading,
  hasSearched,
  searchPrompt,
  selectedFilters,
}: {
  searchResults: APICourse[];
  isLoading: boolean;
  hasSearched: boolean;
  searchPrompt: string;
  selectedFilters: FilterData[];
}) {
  return (
    <div className="overflow-y-auto flex-grow">
      {searchResults.length > 0 ? (
        <div className="h-full overflow-y-auto flex flex-wrap justify-center gap-4 pr-3 pt-3">
          {searchResults.map((course, index) => (
            <Course key={index} course={course} />
          ))}
          <div className="h-15" />
        </div>
      ) : isLoading ? (
        <LoadingSkeletons />
      ) : hasSearched ? (
        <EmptySearchState searchPrompt={searchPrompt} />
      ) : (
        selectedFilters.length === 0 && <DepartmentFilters />
      )}
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="mb-4 animate-pulse h-fit border-1 border-darkblue/20 rounded-xl p-4 flex items-center gap-2 justify-between"
        >
          <div className="flex gap-2 flex-col justify-between">
            <div className="h-5 w-25 bg-darkblue/20 rounded-sm"></div>
            <div className="h-5 w-50 bg-darkblue/20 rounded-sm"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="h-6 w-15 bg-darkblue/20 rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="h-15 w-15 bg-darkblue/20 rounded-full"></div>
        </div>
      ))}
    </>
  );
}

function EmptySearchState({ searchPrompt }: { searchPrompt: string }) {
  return (
    <div className="flex text-darkblue/70 text-center gap-2 items-center flex-col justify-center h-50">
      <h3 className="text-[75px] font-bold">D:</h3>
      <p className="ml-2 text-xl">No courses found for "{searchPrompt}"</p>
      <p className="text-sm">
        Try searching for another course. <br />
        Maybe "CSCI 1100" or "Computer Science I"
      </p>
    </div>
  );
}
