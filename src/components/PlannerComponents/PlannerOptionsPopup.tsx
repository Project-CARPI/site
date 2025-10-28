import React from "react";

interface PlannerOptionsPopupProps {
  handleSelect: (action: () => void) => void;
  handleDuplicate: () => void;
  handleMoveNext: () => void;
  handleMoveToolbox: () => void;
  handleDelete: () => void;
}

const PlannerOptionsPopup: React.FC<PlannerOptionsPopupProps> = ({
  handleSelect,
  ...actions
}) => {
  return (
    <div className="absolute right-0 top-12 bg-carpipink rounded-xl border border-slate-500 text-[#283044] text-xs p-2 shadow-lg z-50 w-36">
      <button
        className="hover:bg-gray-300 p-1 rounded w-full text-left"
        onClick={() => handleSelect(actions.handleDuplicate)}
      >
        Duplicate
      </button>
      <button
        className="hover:bg-gray-300 p-1 rounded w-full text-left"
        onClick={() => handleSelect(actions.handleMoveNext)}
      >
        Move to next sem
      </button>
      <div className="h-px bg-gray-400 my-1" />
      <button
        className="hover:bg-gray-300 p-1 rounded w-full text-left"
        onClick={() => handleSelect(actions.handleMoveToolbox)}
      >
        Move back to toolbox
      </button>
      <button
        className="hover:bg-red-300 p-1 rounded w-full text-left"
        onClick={() => handleSelect(actions.handleDelete)}
      >
        Delete
      </button>
    </div>
  );
};

export default PlannerOptionsPopup;
