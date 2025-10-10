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
import { DragDropContext } from "@hello-pangea/dnd";
import { SemesterType } from "./types/interfaces/Semester.interface.ts";
import { Filters } from "./types/Filters";
import { usePlannerDragAndDrop } from "./hooks/usePlannerDragAndDrop";

export default function App() {
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
  const [searchPrompt, setSearchPrompt] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    Subject: [],
    Attributes: [],
    Semesters: [],
  });

  // The complex logic is now neatly contained in the hook
  const { onDragStart, onDragEnd } = usePlannerDragAndDrop({
    toolboxCourses,
    setToolboxCourses,
    setPlannerCourses,
    setIsDragging,
  });

  return (
    <div className="font-['Helvetica'] min-h-screen">
      <div
        className={`fixed top-0 left-0 w-full h-full z-0 bg-carpipink ${
          isDragging ? "brightness-50" : ""
        }`}
      ></div>
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
  );
}
