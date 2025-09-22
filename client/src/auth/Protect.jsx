import { Navigate, Outlet, useLocation } from "react-router-dom";

const Protect = ({ isLoggedIn, Role }) => {
  const location = useLocation();
  if (!isLoggedIn && Role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Protect;
