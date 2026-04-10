import { createContext, useContext } from "react";

export const CatalogDragContext = createContext<string | null>(null);

export function useCatalogDragId() {
  return useContext(CatalogDragContext);
}
