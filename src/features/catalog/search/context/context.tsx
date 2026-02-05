import { createContext } from "react";

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

export const CatalogContext = createContext<CatalogContextType | undefined>(
  undefined,
);
