import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import Toolbox from "./components/Toolbox/Toolbox";
import HomePage from "./pages/HomePage";
import { DragDropContext } from "@hello-pangea/dnd";
import { CourseWorkspaceProvider } from "./context/CourseWorkspaceProvider.tsx";
import { FilterProvider } from "./context/FilterProvider.tsx";
import { useCourseWorkspace } from "./hooks/useCourseWorkspace.ts";

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
  return (
    <CourseWorkspaceProvider>
      <AppDragDropContext>
        <FilterProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/planner" element={<Planner />} />
            </Routes>
            <Toolbox />
          </Router>
        </FilterProvider>
      </AppDragDropContext>
    </CourseWorkspaceProvider>
  );
}
