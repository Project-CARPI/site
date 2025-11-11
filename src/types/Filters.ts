export type Filters = {
  Subject: string[];
  Attributes: string[];
  Semesters: string[];
};

export type FilterData = {
  id: number;
  code: string;
  type: "Subject" | "Attributes" | "Semesters";
};
