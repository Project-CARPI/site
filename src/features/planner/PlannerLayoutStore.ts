import { create } from "zustand";

interface PlannerLayoutState {
  expandedSemesters: Record<string, boolean>;
  allExpanded: boolean;
  setAllExpanded: (isExpanded: boolean) => void;
  setExpanded: (id: string, isExpanded: boolean) => void;
  toggleExpanded: (id: string) => void;
}

export const usePlannerLayoutStore = create<PlannerLayoutState>((set) => ({
  expandedSemesters: {},
  allExpanded: true,

  // set the expanded state for all semesters
  setAllExpanded: (isExpanded) =>
    set(() => ({ allExpanded: isExpanded, expandedSemesters: {} })),

  // set the expanded state for a specific semester
  setExpanded: (id, isExpanded) =>
    set((state) => ({
      expandedSemesters: { ...state.expandedSemesters, [id]: isExpanded },
    })),

  // toggle the expanded state for a specific semester
  toggleExpanded: (id) =>
    set((state) => ({
      expandedSemesters: {
        ...state.expandedSemesters,
        [id]: !state.expandedSemesters[id],
      },
    })),
}));
