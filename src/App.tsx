import React from "react";

import { DragDropProvider } from "@dnd-kit/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CourseWorkspaceProvider } from "@/core/workspace/provider";
import DragMonitor from "@/features/dnd/dragMonitor";
import Toolbox from "@/features/toolbox/Toolbox";
import Catalog from "@/pages/Catalog";
import HomePage from "@/pages/HomePage";
import Planner from "@/pages/Planner";

const AppDragDropContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const {
  //   collisionDetectionStrategy,
  //   onDragStart,
  //   onDragOver,
  //   onDragEnd,
  //   activeItem,
  // } = useDndLogic();

  // const [isDragging, setIsDragging] = useState(false);

  // const handleDragStart = (event: DragStartEvent) => {
  //   setIsDragging(true);
  //   onDragStart(event); // Your existing logic
  // };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   setIsDragging(false);
  //   onDragEnd(event); // Your existing logic
  // };

  return (
    <DragDropProvider
    // collisionDetection={collisionDetectionStrategy}
    // onDragStart={(event, manager) => handleDragStart(event)}
    // onDragOver={onDragOver}
    // onDragEnd={handleDragEnd}
    >
      <DragMonitor />

      {children}

      {/* {createPortal(
        <DragOverlay>
          {activeItem ? (
            activeItem.type === "semester" ? (
              <div
                className={cn(
                  "opacity-90 scale-95 origin-top-left w-[400px]",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
              >
                <SemesterBlock semester={activeItem.payload} isDragging />
              </div>
            ) : (
              <PlannerCourse
                course={activeItem.payload}
                semesterId={null}
                isDragging
              />
            )
          ) : null}
        </DragOverlay>,
        document.body,
      )} */}
    </DragDropProvider>
  );
};

export default function App() {
  return (
    <CourseWorkspaceProvider>
      <AppDragDropContext>
        <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
          <header className="sticky top-0 flex h-20 items-center justify-center bg-carpipink">
            <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
          </header>

          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/planner" element={<Planner />} />
            </Routes>
            <Toolbox />
          </Router>
        </div>
      </AppDragDropContext>
    </CourseWorkspaceProvider>
  );
}
