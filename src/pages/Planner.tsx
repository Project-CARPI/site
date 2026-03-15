import { useEffect } from "react";

// import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import ActionMenu from "@/features/planner/components/ActionMenu";
import SemesterBlock from "@/features/planner/components/semester/SemesterBlock";
import { cn } from "@/lib/classnames";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

const Planner: React.FC = () => {
  // If user is on desktop, redirect to home page
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  useEffect(() => {
    if (isDesktop) {
      navigate("/");
    }
  }, [isDesktop, navigate]);

  const { plannerCourses } = useCourseWorkspace();

  return (
    <div className="md:h-[calc(100vh-10rem)]">
      <section className="h-full w-full flex flex-col gap-4">
        <div className="flex justify-between sticky top-0 z-10 bg-carpipink pt-4">
          <h1 className="font-bold text-xl">Planner</h1>
          <ActionMenu />
        </div>

        {plannerCourses.length === 0 ? (
          <div className="flex flex-col justify-center text-center opacity-60 italic">
            <p>
              No semesters added yet. <br></br>
              Click "+ New Semester" to get started!
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 lg:grid-cols-2",
              "items-start gap-4 pb-32 overflow-x-hidden",
              "md:overflow-y-auto md:pr-4",
            )}
          >
            {plannerCourses.map((semester, index) => (
              <div
                key={index}
                className="md:h-full flex flex-col justify-between min-w-0 w-full"
              >
                <SemesterBlock
                  key={semester.semesterID}
                  semester={semester}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Planner;
