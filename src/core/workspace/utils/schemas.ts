import { z } from "zod";

/* API SCHEMAS */
export const APICourseSchema = z.object({
  subj_code: z.string(),
  code_num: z.number(),
  title: z.string(),
  desc_text: z.string(),
  credit_min: z.number(),
  credit_max: z.number(),
  sem_list: z.array(z.string()),
  attr_list: z.array(z.string()),
  code_match: z.number(),
  title_exact_match: z.number(),
  title_start_match: z.number(),
  title_match: z.number(),
  title_acronym: z.number(),
  title_abbrev: z.number(),
});

export const UserCourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
  data: APICourseSchema,
});

export const SemesterSchema = z.object({
  semesterTitle: z.string(),
  semesterNumber: z.number(),
  semesterID: z.string(),
  season: z.enum(["Fall", "Spring", "Summer", ""]),
  creditsTotal: z.number(),
  courseList: z.array(UserCourseSchema),
});

/* STORAGE SCHEMAS */
export const ToolboxStorageSchema = z.array(UserCourseSchema);
export const PlannerStorageSchema = z.array(SemesterSchema);
