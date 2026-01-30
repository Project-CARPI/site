import { DndContext, DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CourseWorkspaceProvider } from "@/core/workspace/provider";
import { useDndLogic } from "@/features/dnd/useDragAndDrop";
import { FilterProvider } from "@/features/filters/provider";
import PlannerCourse from "@/features/planner/components/PlannerCourse";
import SemesterBlock from "@/features/planner/components/SemesterBlock";
import Toolbox from "@/features/toolbox/Toolbox";
import { UserCourse } from "@/lib/types";
import Catalog from "@/pages/Catalog";
import HomePage from "@/pages/HomePage";
import Planner from "@/pages/Planner";

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
            "semesterID" in activeItem ? (
              <div className="opacity-90 scale-95 origin-top-left w-[400px]">
                <SemesterBlock semester={activeItem} />
              </div>
            ) : (
              <PlannerCourse
                course={activeItem as UserCourse}
                semesterId={null}
              />
            )
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
