import api from "../../../axios";
import { Filters } from "../../../types/Filters";
import FilterSection from "./FilterSection";
import { useEffect, useState } from "react";

interface FilterPanelProps {
  filters: { [key: string]: string[] };
  updateFilters: (category: keyof Filters, value: string) => void;
}

const formatApiData = (data: string[]) => {
  return data.map((item: string, index: number) => ({
    id: index,
    code: item,
  }));
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  updateFilters,
}) => {
  const [subjects, setSubjects] = useState<{ id: number; code: string }[]>([]);
  const [attributes, setAttributes] = useState<{ id: number; code: string }[]>(
    []
  );
  const [semesters, setSemesters] = useState<{ id: number; code: string }[]>(
    []
  );

  useEffect(() => {
    console.log("getting filters");

    const fetchAllFilters = async () => {
      try {
        const [subjectsResponse, attributesResponse, semestersResponse] =
          await Promise.all([
            api.get("/course/filter/values/departments"),
            api.get("/course/filter/values/attributes"),
            api.get("/course/filter/values/semesters"),
          ]);

        setSubjects(formatApiData(subjectsResponse.data));
        setAttributes(formatApiData(attributesResponse.data));
        setSemesters(formatApiData(semestersResponse.data));
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };

    fetchAllFilters();
  }, []);

  return (
    <div className="w-full">
      <FilterSection
        sectionName="Subject"
        tags={subjects}
        selected={filters.Subject}
        updateFilters={updateFilters}
      />
      <FilterSection
        sectionName="Attributes"
        tags={attributes}
        selected={filters.Attributes}
        updateFilters={updateFilters}
      />
      <FilterSection
        sectionName="Semesters"
        tags={semesters}
        selected={filters.Semesters}
        updateFilters={updateFilters}
      />
    </div>
  );
};

export default FilterPanel;
