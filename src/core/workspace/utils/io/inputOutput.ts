import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { SemesterType, UserCourse } from "@/lib/types";

// --- SCHEMAS ---

export const ExportCourseSchema = z.object({
  code: z.string(),
  title: z.string(),
  count: z.number().optional(),
  course_info: z.object({
    description: z.string(),
    credit_min: z.number(),
    credit_max: z.number(),
    sem_list: z.array(z.string()),
    attr_list: z.array(z.string()),
  }),
});

export const ExportSemesterSchema = z.object({
  semester_number: z.number(),
  semester_title: z.string(),
  season: z.enum(["Fall", "Spring", "Summer", ""]),
  total_credits: z.number(),
  courseList: z.array(ExportCourseSchema),
});

export const SaveFileSchema = z.object({
  version: z.number(),
  timestamp: z.string().optional(),
  planner: z.array(ExportSemesterSchema),
});

export type ExportCourse = z.infer<typeof ExportCourseSchema>;
export type SaveFile = z.infer<typeof SaveFileSchema>;

// --- TRANSFORMERS ---

/**
 * Converts internal UserCourse state -> Clean JSON for export
 */
export const cleanCourseForExport = (course: UserCourse): ExportCourse => {
  return {
    code: course.name,
    title: course.data.title,
    count: course.count > 1 ? course.count : undefined,
    course_info: {
      description: course.data.desc_text,
      credit_min: course.data.credit_min,
      credit_max: course.data.credit_max,
      sem_list: course.data.sem_list,
      attr_list: course.data.attr_list,
    },
  };
};

/**
 * Converts clean JSON from export -> Internal UserCourse state (with new IDs)
 */
export const enrichCourseForImport = (exported: ExportCourse): UserCourse => {
  return {
    id: uuidv4(),
    name: exported.code,
    count: exported.count || 1,
    data: {
      subj_code: exported.code.split(" ")[0],
      code_num: parseInt(exported.code.split(" ")[1]),
      title: exported.title,
      desc_text: exported.course_info.description,
      credit_min: exported.course_info.credit_min,
      credit_max: exported.course_info.credit_max,
      sem_list: exported.course_info.sem_list,
      attr_list: exported.course_info.attr_list,
      // Internal defaults
      code_match: 1,
      title_exact_match: 1,
      title_start_match: 1,
      title_match: 1,
      title_acronym: 1,
      title_abbrev: 1,
    },
  };
};

/**
 * Converts clean JSON from export -> Internal SemesterType state (with new IDs)
 */
export const enrichPlannerForImport = (
  exportedPlanner: z.infer<typeof ExportSemesterSchema>[],
): SemesterType[] => {
  return exportedPlanner.map((sem) => ({
    semesterID: uuidv4(),
    semesterTitle: sem.semester_title,
    semesterNumber: sem.semester_number,
    season: sem.season,
    creditsTotal: sem.total_credits,
    courseList: sem.courseList.map(enrichCourseForImport),
  }));
};
