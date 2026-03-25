
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../../../style/css/Login.css';
import pana from "../../../assets/pana.png";
import BobLogo from "../../../assets/bob-logo1.jpg";
import { useDispatch } from 'react-redux';
import { setUser, setAuthUser, setPrivileges } from '../../../app/providers/userSlice';
import loginApi from "../services/loginService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { mapAuthApiToState } from "../mappers/auth.mapper";
import { mapUserApiToState } from "../mappers/user.mapper";

import { toast } from "react-toastify";


const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedUserId, setUnverifiedUserId] = useState(null);
  const navigate = useNavigate();

  // const encryptPassword = (password) => {
  //   return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  // };

  // const encryptPassword = (password) =>
  //   CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

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

      dispatch(setPrivileges(authApiRes.preveileges));

      const userApiRes = await loginApi.getRecruiterDetails(email);
      dispatch(
        setUser(
          mapUserApiToState(userApiRes)
        )
      );

      // const role = userApiRes?.role?.trim().toLowerCase();

      // if (role === "admin") {
      //   navigate("/users", { replace: true });

      // } else if (role === "l1" || role === "l2") {
      //   navigate("/requisition-requests", { replace: true });

      // } else if (role === "zonal_hr") {
      //   navigate("/candidate-verification", { replace: true });

      // } else if (role === "interviewer") {
      //   navigate("/candidate-interviewer", { replace: true });

      // } else if (role === "recruiter") {
      //   navigate("/job-posting", { replace: true });

      // } else {
      //   navigate("/login", { replace: true });
      // }
      // {
      //   "Admin": false,
      //   "Verification": false,
      //   "JobPostings": false,
      //   "Candidate Pool": false,
      //   "Interview Pool": false,
      //   "Offer Pool": false,
      //   "Compensation Pool": false,
      //   "Committee Management": false,
      //   "Interview": false
      // }
      const privileges = authApiRes.preveileges || {};


      if (privileges.Admin) {
        navigate("/users", { replace: true });

      } else if (privileges["JobPostings"]) {
        navigate("/job-posting", { replace: true });

      } else if (privileges["Candidate Pool"] || privileges["Compensation Pool"]) {
        navigate("/candidate-workflow", { replace: true });

      } else if (privileges.Verification) {
        navigate("/candidate-verification", { replace: true });

      } else if (privileges.Interview) {
        navigate("/candidate-interviewer", { replace: true });

      } else if (privileges["Committee Management"]) {
        navigate("/interviewpanel", { replace: true });

      } else if (privileges["Requisition Approval"]) {
        navigate("/requisition-requests", { replace: true });
      }
      else {
        toast.error("No access assigned to this user");
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