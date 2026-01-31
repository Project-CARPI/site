import { useContext } from "react";

import { CatalogContext } from "@/features/catalog/search/context/context";

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
