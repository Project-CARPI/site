import React from "react";

interface PlannerCourseHolderProps {
  isHover: boolean;
}

const PlannerCourseHolder: React.FC<PlannerCourseHolderProps> = ({
  isHover,
}) => {
  console.log(isHover);
  return (
    <>
      <div
        className={`relative h-18 w-full border-[#c3a9a9] border-dashed border-2 rounded-md text-[#444444] text-center p-5 font-['Helvetica'] bg-transparent transition-all duration-200 ease-in-out`}
      >
        <p className="opacity-100 pointer-events-none">
          Try dragging a course from your Toolbox
        </p>

        {isHover && (
          <div className="absolute top-0 left-0 w-full h-full bg-white rounded-md z-10 shadow-xl flex items-center justify-center">
            <p className="text-[#283044] font-semibold">Drop it here!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PlannerCourseHolder;
