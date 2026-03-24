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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [] as FilterData[],
    attributes: [] as FilterData[],
    semesters: [] as FilterData[],
  });
  const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([]);
  const [searchResults, setSearchResults] = useState<APICourse[]>([]);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const lastNoResultQuery = useRef<string | null>(null);

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

    setHasSearched(true);

    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);

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

  const selectedFilterKeys = useMemo(() => {
    return new Set(selectedFilters.map((f) => `${f.type}-${f.code}`));
  }, [selectedFilters]);

  const value = useMemo(
    () => ({
      filters,
      selectedFilters,
      selectedFilterKeys,
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
      selectedFilterKeys,
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
