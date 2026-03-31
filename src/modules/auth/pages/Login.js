import '../../../style/css/Login.css';
import pana from "../../../assets/pana.png";
import BobLogo from "../../../assets/bob-logo1.jpg";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../services/msalConfig";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setAuthUser, setPrivileges } from "../../../app/providers/userSlice";

const Login = () => {
  const { instance, accounts, inProgress } = useMsal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);
  const authUser = useSelector((state) => state.user?.authUser);

  // 🔐 Trigger Azure login
  const handleLogin = () => {
    instance.loginRedirect({
      ...loginRequest,
      prompt: "select_account",
    });
  };

  // Navigate based on privileges
  const navigateByPrivileges = (privileges) => {
    if (privileges.Admin) {
      navigate("/users", { replace: true });
    } else if (privileges.JobPostings) {
      navigate("/job-posting", { replace: true });
    } else if (
      privileges["Candidate Pool"] ||
      privileges["Compensation Pool"]
    ) {
      navigate("/candidate-workflow", { replace: true });
    } else if (privileges.Verification) {
      navigate("/candidate-verification", { replace: true });
    } else if (privileges.Interview) {
      navigate("/candidate-interviewer", { replace: true });
    } else if (privileges["Committee Management"]) {
      navigate("/interviewpanel", { replace: true });
    } else if (privileges["Requisition Approval"]) {
      navigate("/requisition-requests", { replace: true });
    } else {
      console.error("No privileges assigned");
      alert("No access assigned to this user");
      navigate("/login", { replace: true });
    }
  };

  // 🔥 Handle post-login flow (after Microsoft redirect)
  const handlePostLogin = async (accessToken, email) => {
    try {
      // ✅ Store auth info (Redux) immediately
      dispatch(
        setAuthUser({
          token: accessToken,
          email: email,
        })
      );

      // ✅ Call backend API for user details
      const apiResponse = await fetch(
        "https://192.168.20.111:8085/auth-portal/api/v1/getdetails/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Client": "AzureAD",
            "Content-Type": "application/json",
          },
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await apiResponse.json();
      console.log("User data received:", data);

      // ✅ Store user details
      dispatch(
        setUser({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // ✅ Store privileges (API returns "preveileges" with typo)
      const privileges = data.preveileges || {};
      console.log("Privileges received:", privileges);
      dispatch(setPrivileges(privileges));

      // 🚨 Navigate based on privileges
      navigateByPrivileges(privileges);
    } catch (error) {
      console.error("Post-login error:", error);
      isProcessingRef.current = false;
      alert("Failed to validate user. Please try again.");
      navigate("/login", { replace: true });
    }
  };

  // 🔥 Main effect: Handle MSAL redirect and fetch user data
  useEffect(() => {
    // Don't process if already authenticated or currently processing
    if (authUser || isProcessingRef.current) {
      return;
    }

    // Only process when inProgress is "none" (MSAL has completed redirect)
    if (inProgress !== "none") {
      return;
    }

    // Skip if no accounts
    if (accounts.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    const processLogin = async () => {
      try {
        // Get the account
        const account = accounts[0];
        instance.setActiveAccount(account);

        // Get access token
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: account,
        });

        const accessToken = response.accessToken;
        const email = account.username;

        // Handle post-login (fetch user data and navigate)
        await handlePostLogin(accessToken, email);
      } catch (error) {
        console.error("Token acquisition error:", error);
        isProcessingRef.current = false;
        alert("Failed to authenticate. Please login again.");
        navigate("/login", { replace: true });
      }
    };

    processLogin();
  }, [accounts, instance, dispatch, navigate, authUser, inProgress]);

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={pana} alt="Illustration" />
      </div>

      <div className="right-panel">
        <div className="logo">
          <img src={BobLogo} alt="Logo" />
          <h4>Recruitment Tracking System</h4>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login with Microsoft
        </button>
      </div>
    </div>
  );
};

export default Login;