import { useContext } from "react";
import FilterContext from "../context/FilterContext";

export const useFilterData = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterData must be used within a FilterProvider");
  }
  return context;
};
