import { Link, useLocation } from "react-router-dom";

const NavButton = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Link
      className={`bg-darkblue text-carpipink w-full text-center rounded-t-2xl py-2 absolute bottom-0`}
      to={`${path == "/" ? "/planner" : "/"}`}
    >
      {path == "/" ? "Go to Planner" : "Go to Courses"}
    </Link>
  );
};

export default NavButton;
