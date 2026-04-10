export type FilterCategory = "Subject" | "Attribute" | "Semester";

export interface Filters {
  Subject: string[];
  Attribute: string[];
  Semester: string[];
}

export interface FilterData {
  id: number;
  code: string;
  value: string;
  type: FilterCategory;
}
