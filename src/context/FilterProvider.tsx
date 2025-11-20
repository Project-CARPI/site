import React, { useState, useEffect, ReactNode } from "react";
import api from "../axios.ts";
import {
  FilterData,
  FilterCategory,
} from "../types/interfaces/Filters.interface.ts";
import FilterContext from "./FilterContext.tsx";

const formatApiData = (type: FilterCategory, data: Record<string, string>) => {
  return Object.entries(data).map(([code, value], index) => ({
    id: index,
    code,
    value,
    type,
  }));
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // all states
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

  // selected filter state
  const [selectedFilters, setSelectedFilters] = useState<FilterData[]>([]);

  const toggleFilter = (filter: FilterData) => {
    setSelectedFilters((prevSelected) => {
      const exists = prevSelected.find(
        (f) => f.code === filter.code && f.type === filter.type
      );
      if (exists) {
        return prevSelected.filter(
          (f) => !(f.code === filter.code && f.type === filter.type)
        );
      } else {
        return [...prevSelected, filter];
      }
    });
  };

  const value = {
    subjects,
    attributes,
    semesters,
    selectedFilters,
    toggleFilter,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
