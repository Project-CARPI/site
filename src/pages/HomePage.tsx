import useIsDesktop from "@/lib/hooks/useIsDesktop";
import Catalog from "@/pages/Catalog";
import Planner from "@/pages/Planner";

const HomePage = () => {
  const isDesktop = useIsDesktop();

  return (
    <div className="flex flex-row gap-8">
      <div className="w-full md:w-1/2 lg:w-1/3">
        <Catalog />
      </div>
      {isDesktop && (
        <div className="w-full md:w-1/2 lg:w-2/3">
          <Planner />
        </div>
      )}
    </div>
  );
};

export default HomePage;
