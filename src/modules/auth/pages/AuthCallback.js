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

    const processLogin = async () => {

      try {

        // if (!accounts || accounts.length === 0) return;

        const account = accounts[0];

        const tokenResponse = await instance.acquireTokenSilent({
          // scopes: ["openid", "profile", "email"],
          scopes: ["api://5ef1ea14-0b56-4c9e-ac14-896dd0a92c1c/access_as_user"],
          account
        });

        console.log("MSAL response:", tokenResponse);

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

    processLogin();

  }, [accounts, instance, dispatch, navigate]);

  return <div>Processing login...</div>;
}