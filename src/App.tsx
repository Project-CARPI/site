import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CourseWorkspaceProvider } from "@/core/workspace/provider";
import Toolbox from "@/features/toolbox/Toolbox";
import Catalog from "@/pages/Catalog";
import HomePage from "@/pages/HomePage";
import Planner from "@/pages/Planner";

export default function App() {
  return (
    <CourseWorkspaceProvider>
      <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
        <header className="sticky top-0 flex h-20 items-center justify-center bg-carpipink">
          <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
        </header>

        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/planner" element={<Planner />} />
          </Routes>
          <Toolbox />
        </Router>
      </div>
    </CourseWorkspaceProvider>
  );
}
