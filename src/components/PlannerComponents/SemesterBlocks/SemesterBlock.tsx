import React from "react";
import useIsDesktop from "../../../hooks/useIsDesktop";

import { SemesterType } from "../../../types/interfaces/Semester.interface";
import MobileSemesterBlock from "./MobileSemesterBlock";
import DesktopSemesterBlock from "./DesktopSemesterBlock";

export interface SemesterBlockProps {
  index: number;
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ index, semester }) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <DesktopSemesterBlock
        semester={semester}
        index={index + 1}
        key={semester.semesterNumber}
      />
    );
  } else {
    return (
      <MobileSemesterBlock
        semester={semester}
        index={index + 1}
        key={semester.semesterNumber}
      />
    );
  }
};

export default SemesterBlock;
