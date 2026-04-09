import { z } from "zod";

/* API SCHEMAS */
export const APICourseSchema = z.object({
  subj_code: z.string(),
  code_num: z.coerce.string(),
  title: z.string(),
  desc_text: z.string(),
  credit_min: z.coerce.number(),
  credit_max: z.coerce.number(),
  sem_list: z.array(z.string()),
  attr_list: z.array(z.string()),
  code_match: z.coerce.number(),
  title_exact_match: z.coerce.number(),
  title_start_match: z.coerce.number(),
  title_match: z.coerce.number(),
  title_acronym: z.coerce.number(),
  title_abbrev: z.coerce.number(),
});

export const UserCourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
  credits: z.number(),
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

/* VERSIONED STORAGE SCHEMAS */
// (for future use when we need to make breaking changes to storage format)
export const CURRENT_STORAGE_VERSION = 1;

export const VersionedContainerSchema = z.object({
  version: z.number(),
  data: z.unknown(),
});
