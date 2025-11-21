import { createContext } from "react";
import { FilterData } from "../types/interfaces/Filters.interface";

export interface FilterContextType {
  // available filter options
  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];

  // selected filter values
  selectedFilters: FilterData[];
  toggleFilter: (filter: FilterData) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export default FilterContext;
