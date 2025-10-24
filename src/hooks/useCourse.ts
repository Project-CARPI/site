import { useContext } from "react";
import CourseWorkspaceContext from "../context/CourseWorkspaceContext";

export const usePlanner = () => {
  const context = useContext(CourseWorkspaceContext);
  if (!context) {
    throw new Error("usePlanner must be used within a CourseProvider");
  }
  return context;
};
