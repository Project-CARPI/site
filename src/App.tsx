import { useEffect, useState } from "react";
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
import { Filters, FilterData } from "./types/Filters";
import { usePlannerDragAndDrop } from "./hooks/usePlannerDragAndDrop";
import api from "./axios.ts";

const formatApiData = (data: string[]) => {
  return data.map((item: string, index: number) => ({
    id: index,
    code: item,
  }));
};

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
    plannerCourses,
    setToolboxCourses,
    setPlannerCourses,
    setIsDragging,
  });

  // pre-fetch filter data
  const [subjects, setSubjects] = useState<FilterData[]>([]);
  const [attributes, setAttributes] = useState<FilterData[]>([]);
  const [semesters, setSemesters] = useState<FilterData[]>([]);

  useEffect(() => {
    const fetchAllFilters = async () => {
      try {
        const [subjectsResponse, attributesResponse, semestersResponse] =
          await Promise.all([
            api.get("/course/filter/values/departments"),
            api.get("/course/filter/values/attributes"),
            api.get("/course/filter/values/semesters"),
          ]);

        setSubjects(formatApiData(subjectsResponse.data));
        setAttributes(formatApiData(attributesResponse.data));
        setSemesters(formatApiData(semestersResponse.data));
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };

    fetchAllFilters();
  }, []);

  return (
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
                subjects={subjects}
                attributes={attributes}
                semesters={semesters}
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
                subjects={subjects}
                attributes={attributes}
                semesters={semesters}
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
  );
}
