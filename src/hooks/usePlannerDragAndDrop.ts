import { Dispatch, SetStateAction } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { CourseEntry } from "../types/interfaces/Course.interface";
import { SemesterType } from "../types/interfaces/Semester.interface";

// --- Helper Functions ---

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const cloneCourse = (course: CourseEntry): CourseEntry => {
  return {
    ...course,
    name: `${course.name}-${Math.random().toString(36).substring(2, 7)}`,
    data: { ...course.data },
    count: 1,
  };
};

// --- Hook Definition ---

interface UsePlannerDragAndDropProps {
  toolboxCourses: CourseEntry[];
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

export const usePlannerDragAndDrop = ({
  toolboxCourses,
  setToolboxCourses,
  setPlannerCourses,
  setIsDragging,
}: UsePlannerDragAndDropProps) => {
  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    // Reorder in toolbox
    if (sInd === "toolbox" && dInd === "toolbox") {
      setToolboxCourses((prev) =>
        reorder(prev, source.index, destination.index),
      );
      return;
    }

    // Delete from toolbox
    if (dInd === "garbage" && sInd === "toolbox") {
      setToolboxCourses((prev) =>
        prev.filter((_, index) => index !== source.index),
      );
      return;
    }

    // Reorder within the same semester
    if (sInd === dInd && dInd.startsWith("planner-")) {
      const semesterIndex = parseInt(dInd.split("-")[1]) - 1;
      setPlannerCourses((prev) =>
        prev.map((semester, idx) =>
          idx === semesterIndex
            ? {
                ...semester,
                courseList: reorder(
                  semester.courseList,
                  source.index,
                  destination.index,
                ),
              }
            : semester,
        ),
      );
      return;
    }

    // Move between different semesters
    if (sInd.startsWith("planner-") && dInd.startsWith("planner-")) {
      const sourceSemesterIndex = parseInt(sInd.split("-")[1]) - 1;
      const destSemesterIndex = parseInt(dInd.split("-")[1]) - 1;

      setPlannerCourses((prev) => {
        const updated = [...prev];
        if (
          sourceSemesterIndex >= updated.length ||
          destSemesterIndex >= updated.length
        )
          return prev;

        const sourceSemester = updated[sourceSemesterIndex];
        const destSemester = updated[destSemesterIndex];

        const sourceListCopy = [...sourceSemester.courseList];
        const [movedCourse] = sourceListCopy.splice(source.index, 1);

        updated[sourceSemesterIndex] = {
          ...sourceSemester,
          courseList: sourceListCopy,
          creditsTotal:
            sourceSemester.creditsTotal - movedCourse.data.credit_max,
        };

        const destListCopy = [...destSemester.courseList];
        destListCopy.splice(destination.index, 0, movedCourse);

        updated[destSemesterIndex] = {
          ...destSemester,
          courseList: destListCopy,
          creditsTotal: destSemester.creditsTotal + movedCourse.data.credit_max,
        };

        return updated;
      });
      return;
    }

    // Move from toolbox to planner
    if (sInd === "toolbox" && dInd.startsWith("planner-")) {
      const courseToClone = toolboxCourses.find((c) => c.name === draggableId);
      const semesterIndex = parseInt(dInd.split("-")[1]);

      if (courseToClone) {
        const newCourse = cloneCourse(courseToClone);
        setPlannerCourses((prev) =>
          prev.map((semester, idx) => {
            if (idx + 1 === semesterIndex) {
              const updatedList = [...semester.courseList];
              updatedList.splice(destination.index, 0, newCourse);
              return {
                ...semester,
                courseList: updatedList,
                creditsTotal:
                  semester.creditsTotal + courseToClone.data.credit_max,
              };
            }
            return semester;
          }),
        );
        setToolboxCourses((prev) =>
          prev
            .map((c) =>
              c.name === courseToClone.name ? { ...c, count: c.count - 1 } : c,
            )
            .filter((c) => c.count > 0),
        );
      }
      return;
    }

    // Delete from planner
    if (sInd.startsWith("planner-") && dInd === "garbage") {
      const sourceSemesterIndex = parseInt(sInd.split("-")[1]) - 1;
      setPlannerCourses((prev) => {
        const updated = [...prev];
        if (sourceSemesterIndex >= updated.length) return prev;

        const sourceSemester = updated[sourceSemesterIndex];
        const courseListCopy = [...sourceSemester.courseList];
        const [removedCourse] = courseListCopy.splice(source.index, 1);

        if (!removedCourse) return prev;

        updated[sourceSemesterIndex] = {
          ...sourceSemester,
          courseList: courseListCopy,
          creditsTotal:
            sourceSemester.creditsTotal - removedCourse.data.credit_max,
        };
        return updated;
      });
      return;
    }
  };

  return { onDragStart, onDragEnd };
};
