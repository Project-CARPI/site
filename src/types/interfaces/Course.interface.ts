export interface CourseType {
  subj_code: string;
  code_num: number;
  title: string;
  desc_text: string;
  credit_min: number;
  credit_max: number;
  sem_list: string[];
  attr_list: string[];
  code_match: number;
  title_exact_match: number;
  title_start_match: number;
  title_match: number;
  title_acronym: number;
  title_abbrev: number;
}

export type CourseEntry = {
  name: string;
  count: number;
  data: CourseType;
};
