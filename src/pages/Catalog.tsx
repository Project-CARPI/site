// import { useDroppable } from "@dnd-kit/core";

import CatalogResults from "@/features/catalog/components/CatalogResults";
// import TrashDropZone from "@/features/catalog/components/TrashDropzone";
import { CatalogProvider } from "@/features/catalog/search/context/provider";
import { useCatalog } from "@/features/catalog/search/context/useCatalog";
import SelectedFiltersList from "@/features/catalog/search/filters/SelectedFilters";
import SearchBar from "@/features/catalog/search/SearchBar";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

export default function Catalog() {
  return (
    <CatalogProvider>
      <CatalogContent />
    </CatalogProvider>
  );
}

function CatalogContent() {
  // const { setNodeRef, isOver } = useDroppable({ id: "garbage" });
  const { showFilterPanel } = useCatalog();
  const isDesktop = useIsDesktop();

  // const showTrashZone = isOver && isDesktop;

  return (
    <section
      // ref={setNodeRef}
      className="flex flex-col gap-2 md:h-[calc(100vh-10rem)] md:overflow-hidden"
    >
      <div className="sticky z-10 flex flex-col gap-2">
        <h1 className="font-bold text-xl">Courses</h1>
        <SearchBar />

        {isDesktop && <SelectedFiltersList />}
      </div>

      {(isDesktop || !showFilterPanel) && <CatalogResults />}
    </section>
  );
}
