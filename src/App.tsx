import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Planner from "./pages/Planner";
import Toolbox from "./components/Toolbox/Toolbox";
import HomePage from "./pages/HomePage";
import { CourseWorkspaceProvider } from "./context/CourseWorkspaceProvider.tsx";
import { FilterProvider } from "./context/FilterProvider.tsx";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDndLogic } from "./hooks/useDragAndDrop.ts";
import { createPortal } from "react-dom";
import PlannerCourse from "./components/Course/PlannerCourse.tsx";

const AppDragDropContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    sensors,
    collisionDetectionStrategy,
    onDragStart,
    onDragOver,
    onDragEnd,
    activeItem,
  } = useDndLogic();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}

      {createPortal(
        <DragOverlay>
          {activeItem ? (
            // Render the component appearance while dragging
            <PlannerCourse course={activeItem} semesterId={null} />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
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
