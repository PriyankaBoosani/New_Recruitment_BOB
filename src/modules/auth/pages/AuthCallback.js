import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setAuthUser, setPrivileges } from "../../../app/providers/userSlice";
import { getDefaultRoute } from "../../../shared/utils/user-validations";
import loginApi from "../services/loginService";

export default function AuthCallback() {
  const { instance, accounts, inProgress } = useMsal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("🔄 AuthCallback - inProgress:", inProgress);
    // console.log("📊 Available accounts:", accounts.length);
    // console.log("👤 Active account:", instance.getActiveAccount()?.username || "none");

    const initAuth = async () => {
      try {
        // console.log("✅ Starting authentication...");

        // Get active account directly from instance (may be loaded before accounts array)
        let account = instance.getActiveAccount();
        // console.log("🔍 First attempt - Active account:", account?.username || "none");

        // If no active account, try to use first available
        if (!account && accounts.length > 0) {
          account = accounts[0];
          instance.setActiveAccount(account);
          // console.log("📊 Using first available account:", account?.username);
        }

        // If still no account, wait a moment for MSAL to finish loading
        if (!account && inProgress !== "none") {
          // console.log("⏳ MSAL still loading, waiting...");
          await new Promise((resolve) => setTimeout(resolve, 500));
          account = instance.getActiveAccount();
          // console.log("🔍 After 500ms wait - Active account:", account?.username || "none");
        }

        // If still no account after redirect, user needs to login again
        if (!account) {
          // console.log("❌ No account found after redirect");
          // console.log("📝 Available accounts:", accounts.length);

          // Check if there's auth code in URL (meaning we're coming from Azure login)
          const params = new URLSearchParams(window.location.search);
          const hasAuthCode = params.has("code");

          if (!hasAuthCode) {
            // console.log("ℹ️ No auth code in URL - redirecting to login");
            navigate("/login", { replace: true });
            return;
          }

          // If we have auth code but no account, wait longer
          // console.log("⏳ Auth code detected, waiting longer for account to load...");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          account = instance.getActiveAccount() || accounts[0];
          if (!account) {
            throw new Error("Account not available after redirect");
          }
        }

        // console.log("✅ Account identified:", account.username);

        // Get access token
        let tokenResponse;
        try {
          tokenResponse = await instance.acquireTokenSilent({
            scopes: [process.env.REACT_APP_MSAL_SCOPE],
            account,
          });
        } catch (tokenError) {
          // console.log("⚠️ Silent token acquisition failed, attempting popup...");
          tokenResponse = await instance.acquireTokenPopup({
            scopes: [process.env.REACT_APP_MSAL_SCOPE],
            account,
          });
        }

        const accessToken = tokenResponse.accessToken;
        // console.log("✅ Access token acquired");

        // Store auth in Redux
        dispatch(
          setAuthUser({
            token: accessToken,
            email: account.username,
          })
        );

        const data = await loginApi.getAzureUserDetails(accessToken);

        // if (!apiResponse.ok) {
        //   let errorText = "No error details";
        //   try {
        //     errorText = await apiResponse.text();
        //     console.error("❌ Backend API error text:", errorText);
        //   } catch (e) {
        //     console.error("❌ Could not parse error response");
        //   }
        //   throw new Error(`Backend API failed with status ${apiResponse.status}: ${errorText}`);
        // }

        // Store user info
        dispatch(
          setUser({
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
          })
        );

        // Store privileges
        const privileges = data.privileges || data.preveileges || {};
        dispatch(setPrivileges(privileges));
        // console.log("✅ User data stored, privileges:", Object.keys(privileges));

        // Navigate to appropriate page
        const defaultRoute = getDefaultRoute(privileges);
        // console.log("✅ Navigating to:", defaultRoute);
        navigate(defaultRoute, { replace: true });
      } catch (error) {
        // console.error("❌ Authentication error:", error.message);
        if (error.message.includes("Backend")) {
          navigate("/unauthorized", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
    };

    initAuth();
  }, [instance, accounts, dispatch, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Processing login...</span>
      </div>
    </div>
  );
}
