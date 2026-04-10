import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";

export default function AddSemester() {
  const { addSemester } = useCourseWorkspace();

  return (
    <button
      onClick={addSemester}
      className="border-1 border-black rounded-full px-4 py-2 w-fit text-xs font-medium hover:bg-darkblue/20 transition-colors"
    >
      + New Semester
    </button>
  );
}
