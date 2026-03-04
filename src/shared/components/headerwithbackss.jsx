import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const HeaderWithBackss = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  // ✅ Hooks must be here
  const privileges = useSelector((state) => state.user.privileges);

 const handleBack = () => {
  console.log("🔵 BACK BUTTON CLICKED");

  sessionStorage.setItem("fromPreviewBack", "true");

  const payload = {
    requisition: state.requisition,
    position: state.position,
    preloadedCandidates:
      state.preloadedCandidates || state.candidates || [],
    selectedDate: state.selectedDate
  };

  console.log("📦 Payload being sent:", payload);
  console.log("🔐 Privileges from Redux:", privileges);

  console.log("🔎 Checking privileges...");
  console.log("Interview privilege:", privileges?.Interview);
  console.log("Verification privilege:", privileges?.Verification);
  console.log("Candidate Pool privilege:", privileges?.["Candidate Pool"]);

  if (privileges?.Interview) {
    console.log("✅ Navigating to /candidate-interviewer");
    navigate("/candidate-interviewer", { state: payload });
    return;
  }

  if (privileges?.Verification) {
    console.log("✅ Navigating to /candidate-verification");
    navigate("/candidate-verification", { state: payload });
    return;
  }

  if (privileges?.["Candidate Pool"]) {
    console.log("✅ Navigating to /candidate-workflow");
    navigate("/candidate-workflow", { state: payload });
    return;
  }

  console.log("⚠️ No privilege matched → fallback navigate(-1)");
  navigate(-1);
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