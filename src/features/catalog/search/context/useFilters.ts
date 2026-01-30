import { useState, useEffect } from "react";

import api from "@/lib/axios";
import { FilterData, FilterCategory } from "@/lib/types";

const formatApiData = (type: FilterCategory, data: Record<string, string>) => {
  return Object.entries(data).map(([code, value], index) => ({
    id: index,
    code,
    value,
    type,
  }));
};

export const useFilters = () => {
  const [subjects, setSubjects] = useState<FilterData[]>([]);
  const [attributes, setAttributes] = useState<FilterData[]>([]);
  const [semesters, setSemesters] = useState<FilterData[]>([]);

  useEffect(() => {
    const fetchAllFilters = async () => {
      try {
        const [subjectsResponse, attributesResponse, semestersResponse] =
          await Promise.all([
            api.get("/course/filter/values/subjects"),
            api.get("/course/filter/values/attributes"),
            api.get("/course/filter/values/semesters"),
          ]);

        setSubjects(formatApiData("Subject", subjectsResponse.data));
        setAttributes(formatApiData("Attribute", attributesResponse.data));
        setSemesters(formatApiData("Semester", semestersResponse.data));
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };

    fetchAllFilters();
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([]);

  const toggleFilter = (filter: FilterData) => {
    setSelectedFilters((prevSelected) => {
      const exists = prevSelected.find(
        (f) => f.code === filter.code && f.type === filter.type,
      );
      if (exists) {
        return prevSelected.filter(
          (f) => !(f.code === filter.code && f.type === filter.type),
        );
      } else {
        return [...prevSelected, filter];
      }
    });
  };

  return {
    selectedFilters,
    filters: {
      subjects,
      attributes,
      semesters,
    },
    toggleFilter,
    clearFilters: () => {
      setSelectedFilters([]);
    },
  };
};
