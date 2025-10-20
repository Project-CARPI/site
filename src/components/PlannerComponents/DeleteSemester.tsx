import React from "react";

interface DeleteSemesterProps {
  semesterNumber: number;
  onDelete: (semesterNumber: number) => void;
}

const DeleteSemester: React.FC<DeleteSemesterProps> = ({
  semesterNumber,
  onDelete,
}) => {
  return (
    <div className="flex mt-4 justify-end">
      <button
        onClick={() => onDelete(semesterNumber)}
        className="border border-black rounded-full px-3 py-0 h-fit font-medium text-sm"
      >
        delete
      </button>
    </div>
  );
};

export default DeleteSemester;
