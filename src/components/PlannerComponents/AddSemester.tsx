import React from "react";
import { SemesterType } from "../../types/interfaces/Semester.interface";

interface AddSemesterProps {
  setPlannerCourses: React.Dispatch<React.SetStateAction<SemesterType[]>>;
}

const AddSemester: React.FC<AddSemesterProps> = ({ setPlannerCourses }) => {
  const handleAddCourse = () => {
    setPlannerCourses((prevCourses) => [
      ...prevCourses,
      {
        semesterNumber: prevCourses.length + 1,
        semesterSeason: "fall",
        creditsTotal: 0,
        courseList: [],
      },
    ]);
  };

  return (
    <>
      <button
        onClick={handleAddCourse}
        className="border-1 border-black rounded-3xl w-2/3 mx-auto py-1 my-4"
      >
        + Add Semester Block
      </button>
    </>
  );
};

export default AddSemester;
