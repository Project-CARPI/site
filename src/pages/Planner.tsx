import React from "react";
import SemesterBlock from "../components/PlannerComponents/SemesterBlocks/SemesterBlock";
import AddSemester from "../components/PlannerComponents/AddSemester";
import DeleteSemester from "../components/PlannerComponents/DeleteSemester";
import { useCourseWorkspace } from "../hooks/useCourseWorkspace";

const Planner: React.FC = () => {
  const { plannerCourses, setPlannerCourses, setToolboxCourses } =
    useCourseWorkspace();

  const handleDeleteSemester = (semesterNumber: number) => {
    setPlannerCourses((prev) =>
      prev
        .filter((s) => s.semesterNumber !== semesterNumber)
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 })),
    );
  };

  return (
    <div className="md:h-[calc(100vh-10rem)] md:m-0 m-4 h-screen">
      <header className="md:hidden flex h-20 items-center justify-center bg-carpipink mt-4">
        <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
      </header>

      <section className="h-full w-full md:overflow-y-auto scrollbar-hide pr-4 flex flex-col md:gap-4">
        <div className="flex justify-between sticky top-0 z-10 bg-carpipink pt-4">
          <h1 className="font-bold text-xl">Planner</h1>
          <AddSemester setPlannerCourses={setPlannerCourses} />
        </div>

        <div className="md:grid grid-cols-2 gap-8">
          {plannerCourses.map((semester, index) => (
            <div
              key={semester.semesterNumber}
              className="md:h-full border-b-1 border-darkblue flex flex-col justify-between pb-4"
            >
              <SemesterBlock
                semester={semester}
                index={index}
                key={semester.semesterNumber}
                setPlannerCourses={setPlannerCourses}
                setToolboxCourses={setToolboxCourses}
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
