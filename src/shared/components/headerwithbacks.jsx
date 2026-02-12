import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PageHeaderWithBacks = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  const user = useSelector((s) => s.user.user);
  const role = user?.role?.toLowerCase();

  const isZonalHr = role === "zonal_hr";
  const isInterviewer = role === "interviewer";
  

  const handleBack = () => {
    sessionStorage.setItem("fromPreviewBack", "true");

    let targetRoute = "/candidate-workflow";

    if (isZonalHr) {
      targetRoute = "/candidate-verification";
    } else if (isInterviewer) {
      targetRoute = "/candidate-interviewer";   //  FIX
    }

    console.log("⬅️ Back navigate to:", targetRoute);

    navigate(targetRoute, {
      state: {
        requisition: state.requisition,
        position: state.position,
        preloadedCandidates: state.candidates || [],
        selectedDate: state.selectedDate
      }
    });
  };

  return (
    <div className="d-flex align-items-start" style={{ marginBottom: "12px" }}>
      <div
        className="d-flex align-items-center gap-1"
        style={{
          cursor: "pointer",
          color: "#6c757d",
          fontSize: "14px",
          marginRight: "25px",
          marginTop: "2px"
        }}
        onClick={handleBack}
      >
        <i className="bi bi-arrow-left"></i>
        <span>Back</span>
      </div>

      <div>
        <div style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#162B75",
          lineHeight: "1.2"
        }}>
          {title}
        </div>

        <div style={{
          fontSize: "13px",
          color: "#6c757d",
          marginTop: "2px"
        }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default PageHeaderWithBacks;
