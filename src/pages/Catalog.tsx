import { useState } from "react";

import { useDroppable } from "@dnd-kit/core";

import CatalogResults from "@/features/catalog/components/CatalogResults";
import TrashDropZone from "@/features/catalog/components/TrashDropzone";
import { useFilterData } from "@/features/catalog/search/filters/useFilterData";
import SearchBar from "@/features/catalog/search/SearchBar";
import { useCatalogSearch } from "@/features/catalog/search/useCatalogSearch";
import Tag from "@/features/catalog/Tag";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

const Catalog: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({ id: "garbage" });
  const { selectedFilters } = useFilterData();
  const isDesktop = useIsDesktop();

  const searchLogic = useCatalogSearch(selectedFilters);
  const [showFilter, setShowFilter] = useState(false);

  const showTrashZone = isOver && isDesktop;

  return (
    <section
      ref={setNodeRef}
      className="flex flex-col gap-2 md:h-[calc(100vh-10rem)] md:overflow-hidden"
    >
      {showTrashZone ? (
        <TrashDropZone />
      ) : (
        <>
          <div className="sticky z-10 flex flex-col gap-2">
            <h1 className="font-bold text-xl">Courses</h1>
            <SearchBar
              setSearchPrompt={searchLogic.setSearchPrompt}
              searchPrompt={searchLogic.searchPrompt}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
            />

            {isDesktop && (
              <div className="flex flex-wrap w-full items-start gap-1">
                {selectedFilters.map((filter) => (
                  <Tag key={filter.id} filter={filter} isRemovable={true} />
                ))}
              </div>
            )}
          </div>

          {(isDesktop || !showFilter) && (
            <CatalogResults
              searchResults={searchLogic.searchResults}
              isLoading={searchLogic.isLoading}
              hasSearched={searchLogic.hasSearched}
              searchPrompt={searchLogic.searchPrompt}
              selectedFilters={selectedFilters}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Catalog;
