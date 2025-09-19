import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import Toolbox from "./components/Toolbox/Toolbox";
import HomePage from "./pages/HomePage";
import {
  CourseEntry,
  CourseType,
} from "./types/interfaces/Course.interface.ts";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { SemesterType } from "./types/interfaces/Semester.interface.ts";
import { Filters } from "./types/Filters";

function App() {
  // Original state from App.tsx
  const [toolboxCourses, setToolboxCourses] = useState<CourseEntry[]>([]);
  const [plannerCourses, setPlannerCourses] = useState<SemesterType[]>([
    {
      semesterNumber: 1,
      semesterSeason: "fall",
      creditsTotal: 0,
      courseList: [],
    },
  ]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [searchResults, setSearchResults] = useState<CourseType[]>([]);

  // Moved from SearchBar.tsx
  const [searchPrompt, setSearchPrompt] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    Subject: [],
    Attributes: [],
    Semesters: [],
  });

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

    if (sInd === "toolbox" && dInd === "toolbox") {
      setToolboxCourses((prev) =>
        reorder(prev, source.index, destination.index)
      );
      return;
    }

    if (dInd === "garbage" && sInd === "toolbox") {
      setToolboxCourses((prev) => {
        const updated = [...prev];
        updated.splice(source.index, 1);
        return updated;
      });
      return;
    }

    if (sInd === dInd && dInd.startsWith("planner-")) {
      const semesterIndex = parseInt(dInd.split("-")[1]);
      setPlannerCourses((prev) =>
        prev.map((semester, idx) =>
          idx === semesterIndex - 1
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

    if (sInd.startsWith("planner-") && dInd.startsWith("planner-")) {
      const sourceSemesterIndex = parseInt(sInd.split("-")[1]);
      const destSemesterIndex = parseInt(dInd.split("-")[1]);

      setPlannerCourses((prev) => {
        const updated = [...prev];
        const sourceIdx = sourceSemesterIndex - 1;
        const destIdx = destSemesterIndex - 1;

        const sourceSemester = updated[sourceIdx];
        const destSemester = updated[destIdx];

        if (
          !sourceSemester ||
          !destSemester ||
          source.index < 0 ||
          source.index >= sourceSemester.courseList.length
        ) {
          console.warn("Invalid source or destination index");
          return prev;
        }

        const courseListCopy = [...sourceSemester.courseList];
        const [movedCourse] = courseListCopy.splice(source.index, 1);

        if (!movedCourse) {
          console.warn("Failed to extract course from source");
          return prev;
        }

        updated[sourceIdx] = {
          ...sourceSemester,
          courseList: courseListCopy,
          creditsTotal:
            sourceSemester.creditsTotal - movedCourse.data.credit_max,
        };

        const destListCopy = [...destSemester.courseList];
        destListCopy.splice(destination.index, 0, movedCourse);

        updated[destIdx] = {
          ...destSemester,
          courseList: destListCopy,
          creditsTotal: destSemester.creditsTotal + movedCourse.data.credit_max,
        };

        return updated;
      });

      return;
    }

    const fromToolbox = sInd === "toolbox";
    const toPlanner = dInd.startsWith("planner-");

    if (fromToolbox && toPlanner) {
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
          })
        );

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

    // if (sInd.startsWith("planner-") && dInd === "toolbox") {
    //   const sourceSemesterIndex = parseInt(sInd.split("-")[1]);

    //   setPlannerCourses((prev) => {
    //     const updated = [...prev];
    //     const sourceSemester = updated[sourceSemesterIndex - 1];
    //     const courseListCopy = [...sourceSemester.courseList];
    //     const [removedCourse] = courseListCopy.splice(source.index, 1);

    //     if (!removedCourse) return prev;

    //     updated[sourceSemesterIndex - 1] = {
    //       ...sourceSemester,
    //       courseList: courseListCopy,
    //       creditsTotal:
    //         sourceSemester.creditsTotal - removedCourse.data.credit_max,
    //     };

    //     setToolboxCourses((prevToolbox) => {
    //       const existing = prevToolbox.find(
    //         (c) =>
    //           c.data.dept === removedCourse.data.dept &&
    //           c.data.code_num === removedCourse.data.code_num
    //       );

    //       if (existing) {
    //         return prevToolbox.map((c) =>
    //           c.name === existing.name ? { ...c, count: c.count + 1 } : c
    //         );
    //       } else {
    //         return [
    //           ...prevToolbox,
    //           {
    //             name: removedCourse.data.dept + removedCourse.data.code_num,
    //             data: removedCourse.data,
    //             count: 1,
    //           },
    //         ];
    //       }
    //     });

    //     return updated;
    //   });

    //   return;
    // }

    if (sInd.startsWith("planner-") && dInd === "garbage") {
      const sourceSemesterIndex = parseInt(sInd.split("-")[1]);

      setPlannerCourses((prev) => {
        const updated = [...prev];
        const sourceSemester = updated[sourceSemesterIndex - 1];
        const courseListCopy = [...sourceSemester.courseList];
        const [removedCourse] = courseListCopy.splice(source.index, 1);

        if (!removedCourse) return prev;

        updated[sourceSemesterIndex - 1] = {
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
                  <HomePage
                    isDragging={isDragging}
                    toolboxCourses={toolboxCourses}
                    setToolboxCourses={setToolboxCourses}
                    plannerCourses={plannerCourses}
                    setPlannerCourses={setPlannerCourses}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    searchPrompt={searchPrompt}
                    setSearchPrompt={setSearchPrompt}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    filters={filters}
                    setFilters={setFilters}
                  />
                }
              />
              <Route
                path="/catalog"
                element={
                  <Catalog
                    isDragging={isDragging}
                    toolboxCourses={toolboxCourses}
                    setToolboxCourses={setToolboxCourses}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    searchPrompt={searchPrompt}
                    setSearchPrompt={setSearchPrompt}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    filters={filters}
                    setFilters={setFilters}
                  />
                }
              />
              <Route
                path="/planner"
                element={
                  <Planner
                    isDragging={isDragging}
                    plannerCourses={plannerCourses}
                    setPlannerCourses={setPlannerCourses}
                    setToolboxCourses={setToolboxCourses}
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
