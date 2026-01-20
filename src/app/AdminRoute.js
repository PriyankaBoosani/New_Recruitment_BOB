// src/modules/auth/services/AdminRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const user = useSelector(state => state.user?.user);
  const role = user?.role?.toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
