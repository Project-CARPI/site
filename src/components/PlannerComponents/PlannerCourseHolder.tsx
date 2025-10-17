import React from "react";

interface PlannerCourseHolderProps {
  isHover: boolean;
}

const PlannerCourseHolder: React.FC<PlannerCourseHolderProps> = ({
  isHover,
}) => {
  return (
    <div className="relative h-18 w-full border-[#c3a9a9] border-dashed border-2 rounded-md text-[#444444] text-center p-5 bg-transparent transition-all duration-200 ease-in-out">
      {isHover ? (
        <p className="text-[#283044] font-semibold">Drop it here!</p>
      ) : (
        <p className="opacity-100 pointer-events-none">
          Try dragging a course from your Toolbox
        </p>
      )}
    </div>
  );
};

export default PlannerCourseHolder;
