import React from "react";
import { IoAdd } from "react-icons/io5";

interface AddButtonProps {
  addCourse: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const AddButton: React.FC<AddButtonProps> = ({ addCourse }) => {
  return (
    <button
      className={`hover:cursor-pointer hover:bg-darkblue hover:text-carpipink border-2 border-darkblue rounded-full p-1 text-4xl`}
      onClick={addCourse}
    >
      <IoAdd />
    </button>
  );
};

export default AddButton;
