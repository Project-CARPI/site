import { useContext } from "react";

import { FilterContext } from "@/features/filters/context";

export const useFilterData = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterData must be used within a FilterProvider");
  }
  return context;
};
