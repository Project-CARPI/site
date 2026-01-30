import { cn } from "@/lib/classnames";

interface CourseDropzoneProps {
  isHover: boolean;
}

const CourseDropzone: React.FC<CourseDropzoneProps> = ({ isHover }) => {
  return (
    <div
      className={cn(
        "h-full p-4 flex justify-center items-center w-full border-darkblue/20 border-dashed border-2 rounded-xl transition-all duration-200 ease-in-out opacity-60 italic",
        isHover ? "bg-darkblue/20" : "",
      )}
    >
      {isHover ? (
        <p>Drop the course!</p>
      ) : (
        <p>Drag a course from the Toolbox</p>
      )}
    </div>
  );
};

export default CourseDropzone;
