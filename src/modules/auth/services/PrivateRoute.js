import { Navigate, Outlet } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { instance, accounts, inProgress } = useMsal();
  const authUser = useSelector((state) => state.user?.authUser);

  // ⛔ Wait until MSAL finishes restoring session
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div>Loading...</div>;
  }

  // ✅ If we have authUser from Redux, user is authenticated - allow through
  if (authUser) {
    return <Outlet />;
  }

  let account = instance.getActiveAccount();

  if (!account && accounts.length > 0) {
    account = accounts[0];
    instance.setActiveAccount(account);
  }

  // ❌ No account and no authUser - redirect to login
  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
