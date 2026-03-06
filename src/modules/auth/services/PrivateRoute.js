import { Navigate, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

export default function PrivateRoute() {

  const { accounts, inProgress } = useMsal();

  // MSAL still restoring login state
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div>Loading...</div>;
  }

  // No user logged in
  if (!accounts || accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}