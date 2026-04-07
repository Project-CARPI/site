import { FilterData } from "@/lib/types";

export function findFiltersForCourse(
  api_list: string[],
  filterDataType: FilterData[],
): FilterData[] {
  return filterDataType.filter((attr) => api_list.includes(attr.code));
}
