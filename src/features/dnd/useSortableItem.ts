import { createContext, useContext } from "react";

import { DraggableSyntheticListeners } from "@dnd-kit/core";

interface SortableItemContextType {
  listeners?: DraggableSyntheticListeners;
  attributes?: React.HTMLAttributes<HTMLElement>;
}

export const SortableItemContext = createContext<SortableItemContextType>({});

export const useSortableItem = () => useContext(SortableItemContext);
