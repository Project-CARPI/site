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
    onDragStart(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    onDragEnd(event);
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
      )}
    </DndContext>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <CourseWorkspaceProvider>
        <AppDragDropContext>
          <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
            <header className="sticky top-0 flex h-20 items-center justify-center bg-carpipink">
              <img
                src="/carpi-black.png"
                alt="Carpi Logo"
                className="h-full"
              />
            </header>

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
                        <meta property="og:title" content="CARPI" />
                        <meta
                          property="og:description"
                          content="Plan smarter. Build your RPI schedule with ease."
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
                          content="RPI Course Catalog"
                        />
                        <meta
                          property="og:description"
                          content="Every RPI course, all in one place."
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
                        <meta
                          property="og:title"
                          content="RPI Semester Planner"
                        />
                        <meta
                          property="og:description"
                          content="Drag, drop, and plan your perfect RPI semester."
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
          </div>
        </AppDragDropContext>
      </CourseWorkspaceProvider>
    </HelmetProvider>
  );
}
