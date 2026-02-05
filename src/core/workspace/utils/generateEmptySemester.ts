import { v4 as uuidv4 } from "uuid";

import { SemesterSeason } from "@/lib/types";

export default function generateEmptySemester(semesterNumber: number): {
  semesterID: string;
  semesterTitle: string;
  semesterNumber: number;
  season: SemesterSeason;
  courseList: [];
  creditsTotal: number;
} {
  const seasons: SemesterSeason[] = ["Fall", "Spring", "Summer"];
  const season = seasons[(semesterNumber - 1) % seasons.length];
  const yearOffset = Math.floor((semesterNumber - 1) / seasons.length);
  const currentYear = new Date().getFullYear();
  const year = currentYear + yearOffset;
  const semesterTitle = `${season} ${year}`;

  return {
    semesterID: uuidv4(),
    semesterTitle,
    semesterNumber,
    season,
    courseList: [],
    creditsTotal: 0,
  };
}
