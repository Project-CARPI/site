import { useMemo } from "react";

import { create } from "zustand";

import api from "@/lib/axios";
import { FilterData, FilterCategory, APICourse } from "@/lib/types";

const formatApiData = (type: FilterCategory, data: Record<string, string>) => {
  return Object.entries(data).map(([code, value], index) => ({
    id: index,
    code,
    value,
    type,
  }));
};

interface FilterState {
  filters: {
    subjects: FilterData[];
    attributes: FilterData[];
    semesters: FilterData[];
  };
  isFetchingFilters: boolean;
  hasFetchedFilters: boolean;
  fetchFilters: () => Promise<void>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {
    subjects: [],
    attributes: [],
    semesters: [],
  },
  isFetchingFilters: false,
  hasFetchedFilters: false,

  fetchFilters: async () => {
    // Prevent refetching if we have already successfully fetched the data
    if (get().hasFetchedFilters) return;

    set({ isFetchingFilters: true });

    try {
      const [sub, attr, sem] = await Promise.all([
        api.get("/course/filter/values/subjects"),
        api.get("/course/filter/values/attributes"),
        api.get("/course/filter/values/semesters"),
      ]);

      set({
        filters: {
          subjects: formatApiData("Subject", sub.data),
          attributes: formatApiData("Attribute", attr.data),
          semesters: formatApiData("Semester", sem.data),
        },
        hasFetchedFilters: true,
      });
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    } finally {
      set({ isFetchingFilters: false });
    }
  },
}));

export const useCourseFilters = (course: APICourse) => {
  // ONLY use global filters
  const filters = useFilterStore((state) => state.filters);

  return useMemo(() => {
    const attrFilters = filters.attributes.filter((attr) =>
      (course.attr_list || []).includes(attr.code),
    );

    const semFilters = filters.semesters.filter((sem) =>
      (course.sem_list || []).includes(sem.code),
    );

    return { attrFilters, semFilters };
  }, [filters, course.attr_list, course.sem_list]);
};
