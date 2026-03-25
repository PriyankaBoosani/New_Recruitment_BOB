import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../app/providers/userSlice";

export default function AuthCallback() {

  const { instance, accounts } = useMsal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(() => {

  const initAuth = async () => {
    try {
      const response = await instance.handleRedirectPromise();

      const account = response?.account || accounts[0];
      

      if (!account) {
  navigate("/login");
  return;
}

      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["api://5ef1ea14-0b56-4c9e-ac14-896dd0a92c1c/access_as_user"],
        account
      });

      const accessToken = tokenResponse.accessToken;

      const backendResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/sso-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            email: account.username
          })
        }
      );

      const backendData = await backendResponse.json();

      dispatch(
        setUser({
          msalToken: accessToken,
          account,
          backendData
        })
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed", error);
      navigate("/login");
    }
  };

  initAuth();

}, [instance]);

  return <div>Processing login...</div>;
}