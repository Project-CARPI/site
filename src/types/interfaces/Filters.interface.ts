type FilterCategory = "Subject" | "Attributes" | "Semesters";

export interface Filters {
  Subject: string[];
  Attributes: string[];
  Semesters: string[];
}

export interface FilterData {
  id: number;
  code: string;
  value: string;
  type: FilterCategory;
}
