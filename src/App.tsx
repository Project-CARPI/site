import React, { useState } from "react";

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ButtonTray from "@/components/header/ButtonTray";
import { CourseWorkspaceProvider } from "@/core/workspace/provider";
import { useDndLogic } from "@/features/dnd/useDragAndDrop";
import PlannerCourse from "@/features/planner/components/PlannerCourse";
import SemesterBlock from "@/features/planner/components/SemesterBlock";
import Toolbox from "@/features/toolbox/Toolbox";
import { cn } from "@/lib/classnames";
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

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    onDragStart(event); // Your existing logic
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    onDragEnd(event); // Your existing logic
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {createPortal(
        <DragOverlay>
          {activeItem ? (
            "semesterID" in activeItem ? (
              <div
                className={cn(
                  "opacity-90 scale-95 origin-top-left w-[400px]",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
              >
                <SemesterBlock semester={activeItem} isDragging />
              </div>
            ) : (
              <PlannerCourse
                course={activeItem as UserCourse}
                semesterId={null}
                isDragging
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
        <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
          <header className="top-0 flex h-20 items-center justify-center bg-carpipink relative z-10">
            <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
            <ButtonTray />
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
