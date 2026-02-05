
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../../../style/css/Login.css';
import pana from "../../../assets/pana.png";
import BobLogo from "../../../assets/bob-logo1.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setAuthUser } from '../../../app/providers/userSlice';
import loginApi from "../services/loginService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import { mapAuthApiToState } from "../mappers/auth.mapper";
import { mapUserApiToState } from "../mappers/user.mapper";

import { toast } from "react-toastify";


const Login = () => {
  const SECRET_KEY = "fdf4-832b-b4fd-ccfb9258a6b3";
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedUserId, setUnverifiedUserId] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.auth?.access_token);
  // console.log("Token from Redux:", token);

  // const encryptPassword = (password) => {
  //   return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  // };

 const encryptPassword = (password) =>
    CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //var encryptedPassword=encryptPassword(password);
      const authApiRes = await loginApi.recruiterLogin(email, password);

      // MFA case
      if (authApiRes.mfa_required) {
        dispatch(
          setAuthUser(
            mapAuthApiToState(authApiRes)
          )
        );
        navigate("/verify-otp");
        return;
      }

      // Normal login
      dispatch(
        setAuthUser(
          mapAuthApiToState(authApiRes)
        )
      );

      const userApiRes = await loginApi.getRecruiterDetails(email);
      dispatch(
        setUser(
          mapUserApiToState(userApiRes)
        )
      );

      const role = userApiRes?.role?.toLowerCase();

   if (role === "admin") {
      navigate("/users", { replace: true });
    } else if(role === "zonal_hr"){
    navigate("/candidate-verification", { replace: true });
    }else {
      navigate("/job-posting", { replace: true });
    }

    } catch (err) {
      const errorData = err.response?.data;
      toast.error(errorData?.error_description || "Login failed");
    }
  };


  const handleResendVerification = async () => {
    try {
      await loginApi.resendVerification(unverifiedUserId);
      alert("Verification email sent. Please check your inbox.");
    } catch (err) {
      alert("Failed to resend verification email.");
    }
  };


  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={pana} alt="Illustration" />
        {/* <h2>बैंक ऑफ़ बड़ौदा</h2>
        <h3>Bank of Baroda</h3> */}
      </div>

      <div className="right-panel">
        <div className="logo">
          <img src={BobLogo} alt="Logo" />
          <h4>Recruitment Tracking System</h4>
        </div>

        <form className="login_form" onSubmit={handleLogin}>
          <label>Email Id:</label>
          <input
            type="email"
            value={email}
            required
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>
          <div className="" style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              required
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: '40px' }}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#666',
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            />
          </div>
          {unverifiedUserId && (
            <button
              type="button"
              className="resend-btn my-2 mb-3"
              style={{
                borderRadius: "20px",
                backgroundColor: "#fff",
                border: "1px solid #ff6b00",
                padding: "4px 12px",
                color: "#ff6b00",
              }}
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
          )}


          {/* <div className="actions">
            <span className="forgot-link">Forgot password?</span>
          </div> */}

          <button className="login-button" type="submit">
            LOGIN
          </button>

          {/* <div className="divider">OR</div>

          <button type="button" className="google-button">
            <img src="/images/google-icon.png" alt="Google" />
            Sign up with Google
          </button> */}
          <p className="register-link">
            Forgot Password? <Link to="/forgot-password">Click here</Link>
          </p>


        </form>
      </div>
    </div>
  );
};

export default Login;