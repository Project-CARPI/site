import { ReactNode, useState, useMemo } from "react";

import { CatalogContext } from "@/features/catalog/search/context/context";
import { useCatalogSearch } from "@/features/catalog/search/context/internal/useCatalogSearch";
import { useFilters } from "@/features/catalog/search/context/internal/useFilters";

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const { filters, selectedFilters, toggleFilter, clearFilters } = useFilters();
  const searchLogic = useCatalogSearch(selectedFilters);

  const value = useMemo(
    () => ({
      filters,
      selectedFilters,
      toggleFilter,
      clearFilters,
      ...searchLogic,
      showFilterPanel,
      setShowFilterPanel,
    }),
    [
      filters,
      selectedFilters,
      toggleFilter,
      clearFilters,
      searchLogic,
      showFilterPanel,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}
