import React from "react";

interface PlannerCourseHolderProps {
  isHover: boolean;
}

const PlannerCourseHolder: React.FC<PlannerCourseHolderProps> = (isHover) => {
  console.log(isHover);
  return (
    <>
      <div
        className={`h-18 w-full border-[#c3a9a9] border-dashed border-2 rounded-md text-[#444444] p-5 text-center font-['Helvetica'] ${isHover ? "absolute" : ""}`}
      >
        <p>Try dragging a course from your Toolbox</p>
      </div>
    </>
  );
};

export default PlannerCourseHolder;
