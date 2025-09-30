import React, { Dispatch, SetStateAction } from "react";
import useIsDesktop from "../../../hooks/useIsDesktop";

import { SemesterType } from "../../../types/interfaces/Semester.interface";
import { CourseEntry } from "../../../types/interfaces/Course.interface";
import MobileSemesterBlock from "./MobileSemesterBlock";
import DesktopSemesterBlock from "./DesktopSemesterBlock";

export interface SemesterBlockProps {
  semester: SemesterType;
  index: number;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({
  semester,
  index,
  setPlannerCourses,
  setToolboxCourses,
}) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <DesktopSemesterBlock
        semester={semester}
        index={index + 1}
        key={semester.semesterNumber}
        setPlannerCourses={setPlannerCourses}
        setToolboxCourses={setToolboxCourses}
      />
    );
  } else {
    return (
      <MobileSemesterBlock
        semester={semester}
        index={index + 1}
        key={semester.semesterNumber}
        setPlannerCourses={setPlannerCourses}
        setToolboxCourses={setToolboxCourses}
      />
    );
  }
};

export default SemesterBlock;
