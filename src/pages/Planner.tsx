import React, { useEffect } from "react";
import SemesterBlock from "../components/PlannerComponents/SemesterBlock";
import AddSemester from "../components/PlannerComponents/AddSemester";
import DeleteSemester from "../components/PlannerComponents/DeleteSemester";
import { useCourseWorkspace } from "../hooks/useCourseWorkspace";
import { useNavigate } from "react-router-dom";
import useIsDesktop from "../hooks/useIsDesktop";

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      navigate("/");
    }
  }, [isDesktop, navigate]);

  const { plannerCourses, setPlannerCourses } = useCourseWorkspace();

  const handleDeleteSemester = (semesterNumber: number) => {
    setPlannerCourses((prev) =>
      prev
        .filter((s) => s.semesterNumber !== semesterNumber)
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 }))
    );
  };

  return (
    <div className="md:h-[calc(100vh-10rem)] md:m-0 m-4 h-screen">
      <header className="md:hidden flex h-20 items-center justify-center bg-carpipink mt-4">
        <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
      </header>

      <section className="h-full w-full md:overflow-y-auto scrollbar-hide pr-4 flex flex-col gap-4">
        <div className="flex justify-between sticky top-0 z-10 bg-carpipink pt-4">
          <h1 className="font-bold text-xl">Planner</h1>
          <AddSemester />
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
          {plannerCourses.map((semester, index) => (
            <div
              key={semester.semesterNumber}
              className="md:h-full border-b-1 border-darkblue flex flex-col justify-between pb-4"
            >
              <SemesterBlock
                index={index}
                key={semester.semesterNumber}
                semester={semester}
              />

              <DeleteSemester
                semesterNumber={semester.semesterNumber}
                onDelete={handleDeleteSemester}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Planner;
