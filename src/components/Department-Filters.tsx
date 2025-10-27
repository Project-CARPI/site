import React from "react";
import { Filters } from "../types/Filters";

// Department type
interface Department {
  code: string;
  name: string;
}

// List of Departments
const departments: Department[] = [
  { code: "ADMN", name: "Administrative Courses" },
  { code: "ARCH", name: "Architecture" },
  { code: "ARTS", name: "Arts" },
  { code: "ASTR", name: "Astronomy" },
  { code: "BCBP", name: "BioChemistry & BioPhysics" },
  { code: "BIOL", name: "Biology" },
  { code: "BMED", name: "Biomedical Engineering" },
  { code: "BUSN", name: "Business" },
  { code: "CHEM", name: "Chemistry" },
  { code: "CHME", name: "Chemical Engineering" },
  { code: "CIVL", name: "Civil Engineering" },
  { code: "COGS", name: "Cognitive Science" },
  { code: "COMM", name: "Communication" },
  { code: "CSCI", name: "Computer Science" },
  { code: "ECON", name: "Economics" },
  { code: "ECSE", name: "Electrical, Computer, Systems Engineering" },
  { code: "ENGR", name: "Core Engineering" },
  { code: "ENVE", name: "Environmental Engineering" },
  { code: "ERTH", name: "Earth & Environmental Sci" },
  { code: "GSAS", name: "Games & Simulation Arts & Sciences" },
  { code: "IHSS", name: "HASS Inquiry" },
  { code: "IENV", name: "Interdisciplinary Environmental" },
  { code: "ISCI", name: "Interdisciplinary Science" },
  { code: "ISYE", name: "Industrial & Systems Engineering" },
  { code: "ITWS", name: "Information Technology & Web Sci" },
  { code: "LANG", name: "Languages" },
  { code: "LGHT", name: "Lighting" },
  { code: "LITR", name: "Literature" },
  { code: "MANE", name: "Mech, Aero, Nucl Engineer" },
  { code: "MATH", name: "Mathematics" },
  {
    code: "MATP",
    name: "Mathematical Programming, Probability, and Statistics",
  },
  { code: "MTLE", name: "Material Sciences & Engineering" },
  { code: "PHIL", name: "Philosophy" },
  { code: "PHYS", name: "Physics" },
  { code: "STSO", name: "Science, Technology, & Society" },
  { code: "USAF", name: "Aerospace Studies" },
  { code: "USAR", name: "Military Science" },
  { code: "USNA", name: "Naval Science" },
  { code: "WRIT", name: "Writing" },
];

interface DepartmentFiltersProps {
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
  updateFilters,
}) => {
  return (
    <div className="md:h-full md:w-full md:overflow-y-auto flex flex-wrap justify-center gap-2">
      {departments.map((dept) => (
        <button
          key={dept.code}
          className={`
            px-3 
            py-2 
            rounded-xl 
            border 
            border-darkblue 
            text-xs
            transition-colors
            hover:bg-darkblue hover:text-white
            h-fit
          `}
          onClick={() =>
            updateFilters((prev) => ({
              ...prev,
              Subject: prev.Subject.includes(dept.code)
                ? prev.Subject.filter((code) => code !== dept.code)
                : [...prev.Subject, dept.code],
            }))
          }
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold">{dept.code}</span>
            <span className="font-normal">{dept.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DepartmentFilters;
