import React from "react";

interface PlannerCourseHolderProps {
  isHover: boolean;
}

const PlannerCourseHolder: React.FC<PlannerCourseHolderProps> = ({
  isHover,
}) => {
  return (
    <div
      className={`relative h-20 flex justify-center items-center w-full border-[#c3a9a9] border-dashed border-2 rounded-xl transition-all duration-200 ease-in-out ${isHover ? "bg-darkblue/20" : ""}`}
    >
      {isHover ? (
        <p>Drop the course!</p>
      ) : (
        <p>Drag a course here to add it to this semester</p>
      )}
    </div>
  );
};

export default PlannerCourseHolder;
