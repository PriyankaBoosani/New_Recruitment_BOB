import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivilegeRoute = ({ children, privilege, privilegesRequired }) => {
  const privileges = useSelector((state) => state.user?.privileges);

  if (!privileges) return null;

  // Single privilege
  if (privilege && !privileges[privilege]) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Multiple privileges (OR condition)
  if (
    privilegesRequired &&
    !privilegesRequired.some((key) => privileges[key])
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivilegeRoute;
