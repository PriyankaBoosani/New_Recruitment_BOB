import { Navigate, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

export default function PrivateRoute() {

  const { accounts, inProgress, instance } = useMsal();

  // MSAL still restoring login state
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div>Loading...</div>;
  }

  // No user logged in
  const account = instance.getActiveAccount() || accounts[0];

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}