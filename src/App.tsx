import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import Toolbox from "./components/Toolbox/Toolbox";
import HomePage from "./pages/HomePage";
import { DragDropContext } from "@hello-pangea/dnd";
import { FilterData } from "./types/Filters";
import api from "./axios.ts";
import { CourseWorkspaceProvider } from "./context/CourseWorkspaceProvider.tsx";
import { useCourseWorkspace } from "./hooks/useCourseWorkspace.ts";

const formatApiData = (data: string[]) => {
  return data.map((item: string, index: number) => ({
    id: index,
    code: item,
  }));
};

const AppDragDropContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 2. Get the dnd functions from the hook
  const { onDragStart, onDragEnd } = useCourseWorkspace();
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {children}
    </DragDropContext>
  );
};

export default function App() {
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
    <CourseWorkspaceProvider>
      <AppDragDropContext>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
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
                  subjects={subjects}
                  attributes={attributes}
                  semesters={semesters}
                />
              }
            />
            <Route path="/planner" element={<Planner />} />
          </Routes>
          <Toolbox />
        </Router>
      </AppDragDropContext>
    </CourseWorkspaceProvider>
  );
}
