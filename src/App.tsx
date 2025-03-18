import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import DepartmentFilters from "./components/Department-Filters.tsx";
import Toolbox from "./components/Toolbox/Toolbox";
import { CourseEntry, CourseType } from "./types/interfaces/Course.interface.ts";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Filters } from "./types/Filters";

function App() {
  // Original state from App.tsx
  const [toolboxCourses, setToolboxCourses] = useState<CourseEntry[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Moved from Catalog.tsx
  const [searchResults, setSearchResults] = useState<CourseType[]>([]);
  
  // Moved from SearchBar.tsx
  const [searchPrompt, setSearchPrompt] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    Subject: [],
    Attributes: [],
    Semesters: []
  });

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

  const deleteCourse = (list: CourseEntry[], startIndex: number) => {
    const result = Array.from(list);
    result.splice(startIndex, 1);

    return result;
  };
  
  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination } = result;
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === dInd && sInd === "toolbox") {
      const items = reorder(toolboxCourses, source.index, destination.index);
      setToolboxCourses(items);
    } else if (dInd === "garbage") {
      const items = deleteCourse(toolboxCourses, source.index);
      setToolboxCourses(items);
    }
  };

  const onDragStart = () => {
    setIsDragging(true);
  };
  
  return (
    <>
      <div className={`font-['Helvetica']  min-h-screen`}>
        <div
          className={`fixed top-0 left-0 w-full h-full z-0 bg-carpipink ${isDragging ? "brightness-50" : ""}`}
        ></div>
        <div className={`relative z-10`}>
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
                ></Route>
                <Route path="/filters" element={<DepartmentFilters />} />
                <Route path="/planner" element={<Planner />}></Route>
              </Routes>
              <Toolbox courses={toolboxCourses} isDragging={isDragging} />
            </Router>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;