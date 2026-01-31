import { ReactNode, useState, useEffect, useRef, useMemo } from "react";

import { CatalogContext } from "@/features/catalog/search/context/context";
import api from "@/lib/axios";
import { APICourse, FilterData, FilterCategory } from "@/lib/types";

const formatApiData = (type: FilterCategory, data: Record<string, string>) => {
  return Object.entries(data).map(([code, value], index) => ({
    id: index,
    code,
    value,
    type,
  }));
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  // --- UI State ---
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // --- Filter State ---
  const [filters, setFilters] = useState({
    subjects: [] as FilterData[],
    attributes: [] as FilterData[],
    semesters: [] as FilterData[],
  });
  const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([]);

  // --- Search State ---
  const [searchResults, setSearchResults] = useState<APICourse[]>([]);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNoResultQuery = useRef<string | null>(null);

  // 1. Fetch initial filters
  useEffect(() => {
    const fetchAllFilters = async () => {
      try {
        const [sub, attr, sem] = await Promise.all([
          api.get("/course/filter/values/subjects"),
          api.get("/course/filter/values/attributes"),
          api.get("/course/filter/values/semesters"),
        ]);
        setFilters({
          subjects: formatApiData("Subject", sub.data),
          attributes: formatApiData("Attribute", attr.data),
          semesters: formatApiData("Semester", sem.data),
        });
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchAllFilters();
  }, []);

  // 2. Robust Toggle Logic (Fixed Duplicate Bug)
  const toggleFilter = (filter: FilterData) => {
    setSelectedFilters((prev) => {
      const isAlreadySelected = prev.some(
        (f) => f.code === filter.code && f.type === filter.type,
      );
      return isAlreadySelected
        ? prev.filter(
            (f) => !(f.code === filter.code && f.type === filter.type),
          )
        : [...prev, filter];
    });
  };

  // 3. Debounced Search Logic
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
      if (searchPrompt.length < 3) lastNoResultQuery.current = null;
      if (
        lastNoResultQuery.current &&
        searchPrompt.startsWith(lastNoResultQuery.current)
      ) {
        setIsLoading(false);
        return;
      }

      const getCodes = (type: string) =>
        selectedFilters.filter((f) => f.type === type).map((f) => f.code);

      try {
        const response = await api.get(
          `course/search?searchPrompt=${searchPrompt}&subjFilters=${getCodes("Subject")}&attrFilters=${getCodes("Attribute")}&semFilters=${getCodes("Semester")}`,
        );
        setSearchResults(response.data);
        lastNoResultQuery.current =
          response.data.length === 0 && searchPrompt.length >= 3
            ? searchPrompt
            : null;
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

  // Combine everything into the context value
  const value = useMemo(
    () => ({
      filters,
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
