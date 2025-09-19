import useIsDesktop from "../hooks/useIsDesktop";

import Catalog from "./Catalog";
import Planner from "./Planner";
import { CourseEntry, CourseType } from "../types/interfaces/Course.interface";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { Filters } from "../types/Filters";

interface HomePageProps {
  isDragging: boolean;
  toolboxCourses: CourseEntry[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<CourseEntry[]>>;
  plannerCourses: SemesterType[];
  setPlannerCourses: React.Dispatch<React.SetStateAction<SemesterType[]>>;
  searchResults: CourseType[];
  setSearchResults: React.Dispatch<React.SetStateAction<CourseType[]>>;
  searchPrompt: string;
  setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const HomePage = (props: HomePageProps) => {
  const isDesktop = useIsDesktop();

  return (
    <div>
      <img
        src="/carpi-black.png"
        alt="Carpi Logo"
        className="w-1/4 lg:w-1/12 m-auto pt-5"
      />
      <div className="flex flex-row">
        <div className={isDesktop ? "w-1/2" : "w-full"}>
          <h1 className="font-bold text-xl ml-6">Courses</h1>
          <Catalog
            isDragging={props.isDragging}
            toolboxCourses={props.toolboxCourses}
            setToolboxCourses={props.setToolboxCourses}
            searchResults={props.searchResults}
            setSearchResults={props.setSearchResults}
            searchPrompt={props.searchPrompt}
            setSearchPrompt={props.setSearchPrompt}
            showFilter={props.showFilter}
            setShowFilter={props.setShowFilter}
            filters={props.filters}
            setFilters={props.setFilters}
          />
        </div>
        {isDesktop && (
          <div className="w-1/2">
            <h1 className="font-bold text-xl ml-4">Planner</h1>
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
