import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import DepartmentFilters from "./components/Department-Filters.tsx";
import Toolbox from "./components/Toolbox/Toolbox";
import { CourseEntry } from "./types/interfaces/Course.interface.ts";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { SemesterType } from "./types/interfaces/Semester.interface.ts";

function App() {
  const [toolboxCourses, setToolboxCourses] = useState<CourseEntry[]>([]);
  const [plannerCourses, setPlannerCourses] = useState<SemesterType[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Reorders a simple array
  const reorder = <T,>(
    list: T[],
    startIndex: number,
    endIndex: number
  ): T[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const cloneCourse = (course: CourseEntry): CourseEntry => {
    return {
      ...course,
      name: course.name + "-" + Math.random().toString(36).substring(2, 7),
      data: { ...course.data },
      count: 1,
    };
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    // 1️⃣ Reorder within toolbox
    if (sInd === "toolbox" && dInd === "toolbox") {
      setToolboxCourses((prev) =>
        reorder(prev, source.index, destination.index)
      );
      return;
    }

    // 2️⃣ Delete from toolbox
    if (dInd === "garbage" && sInd === "toolbox") {
      setToolboxCourses((prev) => {
        const updated = [...prev];
        updated.splice(source.index, 1);
        return updated;
      });
      return;
    }

    // 3️⃣ Reorder within a planner semester
    if (sInd === dInd && dInd.startsWith("planner-")) {
      const semesterIndex = parseInt(dInd.split("-")[1]);
      setPlannerCourses((prev) =>
        prev.map((semester, idx) =>
          idx === semesterIndex
            ? {
                ...semester,
                courseList: reorder(
                  semester.courseList,
                  source.index,
                  destination.index
                ),
              }
            : semester
        )
      );
      return;
    }

    // 4️⃣ Moving from toolbox to planner
    const fromToolbox = sInd === "toolbox";
    const toPlanner = dInd.startsWith("planner-");

    if (fromToolbox && toPlanner) {
      const courseToClone = toolboxCourses.find((c) => c.name === draggableId);
      const semesterIndex = parseInt(dInd.split("-")[1]);

      if (courseToClone) {
        const newCourse = cloneCourse(courseToClone);

        setPlannerCourses((prev) =>
          prev.map((semester, idx) =>
            idx + 1 === semesterIndex
              ? {
                  ...semester,
                  courseList: [...semester.courseList, newCourse.data],
                  creditsTotal:
                    semester.creditsTotal + courseToClone.data.credit_max,
                }
              : semester
          )
        );

        // Decrement count or remove from toolbox
        setToolboxCourses((prev) =>
          prev
            .map((c) =>
              c.name === courseToClone.name ? { ...c, count: c.count - 1 } : c
            )
            .filter((c) => c.count > 0)
        );
      }

      return;
    }

    // Add more logic here for planner ↔ planner drag, or planner → toolbox if needed
  };

  return (
    <div className="font-['Helvetica'] min-h-screen">
      <div
        className={`fixed top-0 left-0 w-full h-full z-0 bg-carpipink ${
          isDragging ? "brightness-50" : ""
        }`}
      ></div>
      <div className="relative z-10">
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Catalog
                    isDragging={isDragging}
                    toolboxCourses={toolboxCourses}
                    setToolboxCourses={setToolboxCourses}
                  />
                }
              />
              <Route path="/filters" element={<DepartmentFilters />} />
              <Route
                path="/planner"
                element={
                  <Planner
                    isDragging={isDragging}
                    plannerCourses={plannerCourses}
                    setPlannerCourses={setPlannerCourses}
                  />
                }
              />
            </Routes>
            <Toolbox courses={toolboxCourses} isDragging={isDragging} />
          </Router>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
