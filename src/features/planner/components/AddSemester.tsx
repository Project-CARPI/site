import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";

const AddSemester: React.FC = () => {
  const { addSemester } = useCourseWorkspace();

  return (
    <button
      onClick={addSemester}
      className="border-1 border-black rounded-full px-4 py-2 w-fit text-xs font-medium hover:bg-darkblue/40 transition-colors"
    >
      Add Semester Block
    </button>
  );
};

export default AddSemester;
