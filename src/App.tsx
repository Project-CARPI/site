import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import DepartmentFilters from "./components/Department-Filters.tsx";
import Toolbox from "./components/Toolbox/Toolbox";
import { CourseEntry } from "./types/interfaces/Course.interface.ts";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

function App() {
  const [toolboxCourses, setToolboxCourses] = useState<CourseEntry[]>([]);
  // const [savedCourses, setSavedCourses] = useState<{
  //   [key: string]: CourseType;
  // }>({});

  const reorder = (
    list: CourseEntry[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // If dropped outside, do nothing

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(toolboxCourses, source.index, destination.index);
      setToolboxCourses(items);
    }
  };
  return (
    <>
      <div className="font-['Helvetica'] bg-carpipink min-h-screen">
        <DragDropContext onDragEnd={onDragEnd}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Catalog
                    toolboxCourses={toolboxCourses}
                    setToolboxCourses={setToolboxCourses}
                    // setSavedCourses={setSavedCourses}
                  />
                }
              ></Route>
              <Route path="/filters" element={<DepartmentFilters />} />
              <Route
                path="/planner"
                element={
                  <Planner
                  // savedCourses={savedCourses}
                  />
                }
              ></Route>
            </Routes>
            <Toolbox courses={toolboxCourses} />
          </Router>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
