// src/features/catalog/search/CatalogContext.tsx
import { createContext, useContext, ReactNode, useState, useMemo } from "react";

import { useCatalogSearch } from "@/features/catalog/search/context/useCatalogSearch";
import { useFilters } from "@/features/catalog/search/context/useFilters";
import { APICourse, FilterData } from "@/lib/types";

interface CatalogContextType {
  // Filter State
  filters: {
    subjects: FilterData[];
    attributes: FilterData[];
    semesters: FilterData[];
  };
  selectedFilters: FilterData[];
  toggleFilter: (filter: FilterData) => void;
  clearFilters: () => void;

  // Search State
  searchPrompt: string;
  setSearchPrompt: (prompt: string) => void;
  searchResults: APICourse[];
  isLoading: boolean;
  hasSearched: boolean;

  // UI State (Colocation)
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

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

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
