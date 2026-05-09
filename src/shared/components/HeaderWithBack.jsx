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

  // const handleBack = () => {
  //   const state = location.state || {};
  //   const from = state.from;

  //   // fallback if from missing
  //   const target = from || "/candidate-workflow";

  //   // 🔥 keep this (your interviewer depends on it)
  //   sessionStorage.setItem("fromPreviewBack", "true");

  //   navigate(target, {
  //     state: {
  //       requisition: state.requisition,
  //       position: state.position,
  //      positionIds:
  // Array.isArray(state.positionIds) &&
  // state.positionIds.length > 0
  //   ? state.positionIds
  //   : Array.isArray(state.position)
  //     ? state.position.map(p => p.positionId)
  //     : state.position?.positionId
  //       ? [state.position.positionId]
  //       : [],
  //       preloadedCandidates:
  //         state.preloadedCandidates || state.candidates || [],
  //       selectedDate: state.selectedDate,

  //       // keep ids also (for workflow)
  //       requisitionId,
  //       positionId,
  //       activeTab,
  //         page: state.page,
  //       pageSize: state.pageSize,
  //       // 🔥 ADD THESE
  //       interviewPage: state.interviewPage,
  //       interviewPageSize: state.interviewPageSize,
  //       filters: state.filters
  //     }
  //   });
  // };








  const handleBack = () => {
  const state = location.state || {};
  const from = state.from;

  // fallback if from missing
  const target = from || "/candidate-workflow";

  console.log("🔙 HeaderWithBack handleBack");

  console.log("target:", target);

  console.log("requisition:", state.requisition);

  console.log("position:", state.position);

  console.log("positionIds:", state.positionIds);

  console.log(
    "derivedPositionIds:",
    Array.isArray(state.positionIds) &&
      state.positionIds.length > 0
      ? state.positionIds
      : Array.isArray(state.position)
        ? state.position.map(p => p.positionId)
        : state.position?.positionId
          ? [state.position.positionId]
          : []
  );

  console.log(
    "preloadedCandidates:",
    state.preloadedCandidates || state.candidates || []
  );

  console.log("selectedDate:", state.selectedDate);

  console.log("requisitionId:", requisitionId);

  console.log("positionId:", positionId);

  console.log("activeTab:", activeTab);

  console.log("page:", state.page);

  console.log("pageSize:", state.pageSize);

  console.log("interviewPage:", state.interviewPage);

  console.log("interviewPageSize:", state.interviewPageSize);

  console.log("filters:", state.filters);

  // 🔥 keep this (your interviewer depends on it)
  sessionStorage.setItem("fromPreviewBack", "true");

  navigate(target, {
    state: {
      requisition: state.requisition,
      position: state.position,

      positionIds:
        Array.isArray(state.positionIds) &&
        state.positionIds.length > 0
          ? state.positionIds
          : Array.isArray(state.position)
            ? state.position.map(p => p.positionId)
            : state.position?.positionId
              ? [state.position.positionId]
              : [],

      preloadedCandidates:
        state.preloadedCandidates || state.candidates || [],

      selectedDate: state.selectedDate,

      // keep ids also (for workflow)
      requisitionId,
      positionId,
      activeTab,

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