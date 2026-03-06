import '../../../style/css/Login.css';
import pana from "../../../assets/pana.png";
import BobLogo from "../../../assets/bob-logo1.jpg";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../services/msalConfig";
import { useEffect } from 'react';

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

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