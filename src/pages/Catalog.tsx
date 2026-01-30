import { useDroppable } from "@dnd-kit/core";

import CatalogResults from "@/features/catalog/components/CatalogResults";
import TrashDropZone from "@/features/catalog/components/TrashDropzone";
import {
  CatalogProvider,
  useCatalog,
} from "@/features/catalog/search/context/context";
import SearchBar from "@/features/catalog/search/SearchBar";
import Tag from "@/features/catalog/Tag";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

export default function Catalog() {
  return (
    <CatalogProvider>
      <CatalogContent />
    </CatalogProvider>
  );
}

function CatalogContent() {
  const { setNodeRef, isOver } = useDroppable({ id: "garbage" });
  const { selectedFilters, showFilterPanel } = useCatalog();
  const isDesktop = useIsDesktop();

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
            <SearchBar />

            {isDesktop && (
              <div className="flex flex-wrap w-full items-start gap-1">
                {selectedFilters.map((filter) => (
                  <Tag key={filter.id} filter={filter} isRemovable={true} />
                ))}
              </div>
            )}
          </div>

          {(isDesktop || !showFilterPanel) && <CatalogResults />}
        </>
      )}
    </section>
  );
}
