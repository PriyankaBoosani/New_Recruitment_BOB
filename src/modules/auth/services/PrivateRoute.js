import { Navigate, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

export default function PrivateRoute() {
  const { instance, accounts, inProgress } = useMsal();

  // ⛔ Wait until MSAL finishes restoring session
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div>Loading...</div>;
  }

  let account = instance.getActiveAccount();

  if (!account && accounts.length > 0) {
    account = accounts[0];
    instance.setActiveAccount(account);
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}