import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderWithBackss = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

const handleBack = () => {
  sessionStorage.setItem("fromPreviewBack", "true");

  const payload = {
    requisition: state.requisition,
    position: state.position,
    preloadedCandidates:
      state.preloadedCandidates || state.candidates || [],
    selectedDate: state.selectedDate
  };

  console.log("⬅️ Recruiter Back CLICKED");
  console.log("📤 Sending to interviewer:", payload);
  console.log(
    "👥 preloadedCandidates size:",
    payload.preloadedCandidates?.length
  );

  console.log("📤 Back nav requisition:", payload.requisition);


  navigate("/candidate-interviewer", { state: payload });
};


  return (
    <div className="d-flex align-items-start" style={{ marginBottom: 12 }}>
      <div
        className="d-flex align-items-center gap-1"
        style={{
          cursor: "pointer",
          color: "#6c757d",
          fontSize: 14,
          marginRight: 25,
          marginTop: 2
        }}
        onClick={handleBack}
      >
        <i className="bi bi-arrow-left"></i>
        <span>Back</span>
      </div>

      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#162B75" }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#6c757d" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default HeaderWithBackss;
