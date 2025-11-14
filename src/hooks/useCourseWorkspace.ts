import { useContext } from "react";
import CourseWorkspaceContext from "../context/CourseWorkspaceContext";

export const useCourseWorkspace = () => {
  const context = useContext(CourseWorkspaceContext);
  if (!context) {
    throw new Error(
      "useCourseWorkspace must be used within a CourseWorkspaceProvider",
    );
  }
  return context;
};
