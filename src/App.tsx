import React, { useState } from "react";

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
    <HelmetProvider>
      <CourseWorkspaceProvider>
        <AppDragDropContext>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Helmet>
                      <title>CARPI Course Planner</title>
                      <meta
                        name="description"
                        content="Plan your RPI courses with CARPI — browse the course catalog and build your semester schedule."
                      />
                      <meta
                        property="og:title"
                        content="CARPI Course Planner"
                      />
                      <meta
                        property="og:description"
                        content="Plan your RPI courses with CARPI — browse the course catalog and build your semester schedule."
                      />
                      <meta property="og:type" content="website" />
                    </Helmet>
                    <HomePage />
                  </>
                }
              />
              <Route
                path="/catalog"
                element={
                  <>
                    <Helmet>
                      <title>Course Catalog | CARPI</title>
                      <meta
                        name="description"
                        content="Search and browse RPI courses by name, subject, or credit hours."
                      />
                      <meta
                        property="og:title"
                        content="Course Catalog | CARPI"
                      />
                      <meta
                        property="og:description"
                        content="Search and browse RPI courses by name, subject, or credit hours."
                      />
                      <meta property="og:type" content="website" />
                    </Helmet>
                    <Catalog />
                  </>
                }
              />
              <Route
                path="/planner"
                element={
                  <>
                    <Helmet>
                      <title>My Planner | CARPI</title>
                      <meta
                        name="description"
                        content="Build and manage your RPI semester plan — add courses, organize semesters, and track your progress."
                      />
                      <meta property="og:title" content="My Planner | CARPI" />
                      <meta
                        property="og:description"
                        content="Build and manage your RPI semester plan — add courses, organize semesters, and track your progress."
                      />
                      <meta property="og:type" content="website" />
                    </Helmet>
                    <Planner />
                  </>
                }
              />
            </Routes>
            <Toolbox />
          </Router>
        </AppDragDropContext>
      </CourseWorkspaceProvider>
    </HelmetProvider>
  );
}
