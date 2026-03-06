import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const PageHeaderWithBack = ({ title, subtitle, positionId, requisitionId, candidateScreening, activeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

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
        onClick={() => navigate(candidateScreening ? "/candidate-workflow" : -1, {state: {requisitionId, positionId, activeTab}})}
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
