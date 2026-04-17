import { ReactNode, useState, useEffect, useRef, useMemo } from "react";

import { CatalogContext } from "@/features/catalog/search/context/context";
import api from "@/lib/axios";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { APICourse, FilterData } from "@/lib/types";

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { filters, fetchFilters } = useFilterStore();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([]);
  const [searchResults, setSearchResults] = useState<APICourse[]>([]);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const toggleFilter = (filter: FilterData) => {
    setSelectedFilters((prev) => {
      const isAlreadySelected = prev.some(
        (f) => f.code === filter.code && f.type === filter.type,
      );

      if (isAlreadySelected) {
        return prev.filter(
          (f) => !(f.code === filter.code && f.type === filter.type),
        );
      } else {
        return [...prev, filter];
      }
    });
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (searchPrompt.length === 0 && selectedFilters.length === 0) {
      setHasSearched(false);
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    debounceTimeout.current = setTimeout(async () => {
      const getCodes = (type: string) =>
        selectedFilters.filter((f) => f.type === type).map((f) => f.code);

      try {
        const response = await api.get(
          `course/search?searchPrompt=${searchPrompt}&subjFilters=${getCodes("Subject")}&attrFilters=${getCodes("Attribute")}&semFilters=${getCodes("Semester")}`,
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [selectedFilters, searchPrompt]);

  const value = useMemo(
    () => ({
      filters, // <-- Still providing this down to Context consumers so existing code doesn't break
      selectedFilters,
      toggleFilter,
      clearFilters: () => setSelectedFilters([]),
      searchPrompt,
      setSearchPrompt,
      searchResults,
      isLoading,
      hasSearched,
      showFilterPanel,
      setShowFilterPanel,
    }),
    [
      filters,
      selectedFilters,
      searchPrompt,
      searchResults,
      isLoading,
      hasSearched,
      showFilterPanel,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}
