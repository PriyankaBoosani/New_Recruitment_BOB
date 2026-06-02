import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const HeaderWithBackss = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const state = location.state || {};

  //  Hooks must be here
  const privileges = useSelector((state) => state.user.privileges);

  const handleBack = () => {
    sessionStorage.setItem("fromPreviewBack", "true");

    const payload = {
      requisition: state.requisition,
      position: state.position,
      preloadedCandidates: state.preloadedCandidates || state.candidates || [],
      selectedDate: state.selectedDate,
      page: state.page,
      pageSize: state.pageSize,
    };

    if (privileges?.Interview) {
      navigate("/candidate-interviewer", { state: payload });
      return;
    }

    if (privileges?.Verification) {
      navigate("/candidate-verification", { state: payload });
      return;
    }

    if (privileges?.["Candidate Pool"]) {
      navigate("/candidate-workflow", { state: payload });
      return;
    }

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
          marginTop: 2,
        }}
        onClick={handleBack}
      >
        <i className="bi bi-arrow-left"></i>
        <span>{t("back")}</span>
      </div>

      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#162B75" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#6c757d" }}>{subtitle}</div>
      </div>
    </div>
  );
};

export default HeaderWithBackss;
