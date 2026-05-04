import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageHeaderWithBack = ({
  title,
  subtitle,
  positionId,
  requisitionId,
  activeTab
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const handleBack = () => {
    const state = location.state || {};
    const from = state.from;

    // fallback if from missing
    const target = from || "/candidate-workflow";

    // 🔥 keep this (your interviewer depends on it)
    sessionStorage.setItem("fromPreviewBack", "true");
    console.log("HeaderWithBack - navigating to:", target, "with state:", state);

    navigate(target, {
      state: {
        requisition: state.requisition,
        position: state.position,
        preloadedCandidates:
          state.preloadedCandidates || state.candidates || [],
        selectedDate: state.selectedDate,

        // 🔥 safer mapping
        requisitionId: state.requisitionId || requisitionId,
        positionId: state.positionId || positionId,
        activeTab: state.activeTab || activeTab,
        // 🔥 ADD THESE
        page: state.page,
        pageSize: state.pageSize,
        // 🔥 ADD THESE
        interviewPage: state.interviewPage,
        interviewPageSize: state.interviewPageSize,
        filters: state.filters
      }
    });
  };

  return (
    <div
      className="d-flex align-items-start"
      style={{ marginBottom: "12px" }}
    >
      {/* BACK BUTTON */}
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
        <span>{t("back")}</span>
      </div>

      {/* TITLE + SUBTITLE */}
      <div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#162B75",
            lineHeight: "1.2"
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#6c757d",
            marginTop: "2px"
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default PageHeaderWithBack;