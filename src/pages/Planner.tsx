import React from "react";
import PlannerCourse from "../components/PlannerComponents/PlannerCourse";
import SemesterBlock from "../components/PlannerComponents/SemesterBlock";

function Planner() {
  const exampleCourse = {
    dept: "CSCI",
    code_num: "2600",
    title: "PRINCIPLES OF SOFTWARE",
    desc_text: "A study of important concepts in software design, implementation, and testing. Topics include specification, abstraction with classes, design principles and patterns, testing, refactoring, the software development process, GUI and event-driven programming, and cloud-based programming. The course also introduces implementation and testing tools, including IDEs, revision control systems, and other frameworks. The overarching goal of the course is for students to learn how to write correct and maintainable software.",
    credit_min: 4,
    credit_max: 4,
    sem_list: "Spring 2023,Spring 2024,Summer 2023,Summer 2024",
    attr_list: "",
    code_match: 0,
    title_exact_match: 1,
    title_start_match: 1,
    title_match: 1,
    title_acronym: 0,
    title_abbrev: 1
  };



  const exampleSemester = {
    semesterNumber: 1,
    semesterSeason: "FALL",
    creditsTotal: 16,
    courseList: [exampleCourse,exampleCourse,exampleCourse,exampleCourse]
  };
 


  return (
    <>
    <div className="bg-[#F5CECE] p-4 flex min-h-screen h-fit flex-col"><SemesterBlock semester = {exampleSemester} /> <SemesterBlock semester = {exampleSemester}/> <SemesterBlock semester = {exampleSemester} /> </div>
      
    </>

    
  );

}

export default Planner;




