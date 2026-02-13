import { useEffect } from "react";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { SortableItem } from "@/features/dnd/components/SortableItem";
import AddSemester from "@/features/planner/components/AddSemester";
import SemesterBlock from "@/features/planner/components/SemesterBlock";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      navigate("/");
    }
  }, [isDesktop, navigate]);

  const { plannerCourses } = useCourseWorkspace();

  return (
    <div className="md:h-[calc(100vh-10rem)] md:m-0 m-4 h-screen">
      <section className="h-full w-full flex flex-col gap-4">
        <div className="flex justify-between sticky top-0 z-10 bg-carpipink pt-4">
          <h1 className="font-bold text-xl">Planner</h1>
          <AddSemester />
        </div>

        {plannerCourses.length === 0 ? (
          <div className="flex flex-col justify-center text-center opacity-60 italic">
            <p>
              No semesters added yet. <br></br>
              Click "Add Semester Block" to get started!
            </p>
          </div>
        ) : (
          <div className="md:overflow-y-auto grid md:grid-cols-2 gap-4 md:pr-4 pb-30">
            <SortableContext
              items={plannerCourses.map((s) => "sem-" + s.semesterID)}
              strategy={rectSortingStrategy}
            >
              {plannerCourses.map((semester) => (
                <SortableItem
                  key={semester.semesterID}
                  id={"sem-" + semester.semesterID}
                  data={semester}
                  type="Semester"
                  useHandle={true}
                >
                  <div className="md:h-full flex flex-col justify-between">
                    <SemesterBlock
                      key={semester.semesterID}
                      semester={semester}
                    />
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        )}
      </section>
    </div>
  );
};

export default Planner;
