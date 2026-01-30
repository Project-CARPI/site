import { createContext } from "react";

import { FilterData } from "@/lib/types";

export interface FilterContextType {
  // available filter options
  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];

  // selected filter values
  selectedFilters: FilterData[];
  toggleFilter: (filter: FilterData) => void;
}

export const FilterContext = createContext<FilterContextType | null>(null);
