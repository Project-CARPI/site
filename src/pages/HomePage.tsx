import useIsDesktop from "../hooks/useIsDesktop";

import Catalog from "./Catalog";
import Planner from "./Planner";
import { CourseEntry } from "../types/interfaces/Course.interface";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { FilterData } from "../types/Filters";

interface HomePageProps {
  isDragging: boolean;
  toolboxCourses: CourseEntry[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<CourseEntry[]>>;
  plannerCourses: SemesterType[];
  setPlannerCourses: React.Dispatch<React.SetStateAction<SemesterType[]>>;

  subjects: FilterData[];
  attributes: FilterData[];
  semesters: FilterData[];
}

const HomePage = (props: HomePageProps) => {
  const isDesktop = useIsDesktop();

  return (
    <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
      <header className="sticky top-0 flex h-20 items-center justify-center bg-carpipink">
        <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
      </header>

      <div className="flex flex-row gap-8">
        <div className={isDesktop ? "w-1/2" : "w-full"}>
          <Catalog
            isDragging={props.isDragging}
            toolboxCourses={props.toolboxCourses}
            setToolboxCourses={props.setToolboxCourses}
            subjects={props.subjects}
            attributes={props.attributes}
            semesters={props.semesters}
          />
        </div>
        {isDesktop && (
          <div className="w-1/2">
            <Planner
              isDragging={props.isDragging}
              plannerCourses={props.plannerCourses}
              setPlannerCourses={props.setPlannerCourses}
              setToolboxCourses={props.setToolboxCourses}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
