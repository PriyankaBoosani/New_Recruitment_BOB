import React from "react";
import "../../../style/css/Dashboard/StatCard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StatCard = ({ title, value, color, bgColor, iconBg, icon }) => {
  return (
    <div className="dashboard-stat-card" style={{ background: bgColor }}>
      <div className="dashboard-stat-icon" style={{ background: iconBg }}>
        <FontAwesomeIcon icon={icon} size="2x" style={{ color }} />
      </div>

      <div className="dashboard-stat-content">
        <h2 style={{ color }}>{value}</h2>

        <div className="stat-card-title">{title}</div>

        <div className="view-details" style={{ color }}>
          Click for details →
        </div>
      </div>
    </div>
  );
};

export default StatCard;
