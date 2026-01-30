import { useEffect, useRef, useState } from "react";

import { FilterData } from "@/features/catalog/search/filters/types";
import { APICourse } from "@/features/course/interfaces";
import api from "@/lib/axios";

export const useCatalogSearch = (selectedFilters: FilterData[]) => {
  const [searchResults, setSearchResults] = useState<APICourse[]>([]);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNoResultQuery = useRef<string | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // Reset if inputs are empty
    if (searchPrompt.length === 0 && selectedFilters.length === 0) {
      setHasSearched(false);
      setSearchResults([]);
      setIsLoading(false);
      lastNoResultQuery.current = null;
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

      // Prepare Query Params
      const subjFilters = selectedFilters
        .filter((f) => f.type === "Subject")
        .map((f) => f.code);
      const attrFilters = selectedFilters
        .filter((f) => f.type === "Attribute")
        .map((f) => f.code);
      const semFilters = selectedFilters
        .filter((f) => f.type === "Semester")
        .map((f) => f.code);

      try {
        const response = await api.get(
          `course/search?searchPrompt=${searchPrompt}&subjFilters=${subjFilters}&attrFilters=${attrFilters}&semFilters=${semFilters}`,
        );

        const data = response.data;
        setSearchResults(data);
        setIsLoading(false);

        // Cache no-result queries to save API calls
        if (data.length === 0 && searchPrompt.length >= 3) {
          lastNoResultQuery.current = searchPrompt;
        } else {
          lastNoResultQuery.current = null;
        }
      } catch (error) {
        console.error("Search error:", error);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [selectedFilters, searchPrompt]);

  return {
    searchResults,
    searchPrompt,
    setSearchPrompt,
    isLoading,
    hasSearched,
  };
};
