import React from "react";
import { useNavigate } from "react-router-dom";

const PageHeaderWithBack = ({ title, subtitle }) => {
  const navigate = useNavigate();

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
          marginRight: "14px",
          marginTop: "2px"
        }}
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i>
        <span>Back</span>
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
