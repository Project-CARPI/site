import React, { useRef } from "react";
import { SemesterType } from "../../types/interfaces/Semester.interface";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";

const AddSemester: React.FC = () => {
  const { setPlannerCourses } = useCourseWorkspace();

  const nextId = useRef(1); // keeps a persistent counter across re-renders

  const handleAddCourse = () => {
    setPlannerCourses((prevCourses) => {
      const newSemester: SemesterType = {
        semesterID: `sem-${nextId.current}`, // e.g. sem-1, sem-2, sem-3...
        semesterNumber: prevCourses.length + 1,
        season: "Fall",
        creditsTotal: 0,
        courseList: [],
      };

      nextId.current += 1;
      return [...prevCourses, newSemester];
    });
  };

  return (
    <button
      onClick={handleAddCourse}
      className="border-1 border-black rounded-full px-4 py-2 w-fit text-xs font-medium hover:bg-darkblue/40 transition-colors"
    >
      Add Semester Block
    </button>
  );
};

export default AddSemester;
