import React from "react";
import { FiUsers, FiUserCheck, FiClipboard } from "react-icons/fi";
import "../../../style/css/Dashboard/Committee.css";

const Committee = ({ committeeOverview, onCardClick }) => {
  const committeeData = [
    {
      key: "interviewPanel",
      title: "Interview Panel",
      value: committeeOverview?.interviewPanel || 0,
      label: "Total Panelists",
      className: "blue",
      color: "#003B95",
      icon: <FiUsers />,
      bg: "#eef4ff",
    },
    {
      key: "screeningPanel",
      title: "Screening Panel",
      value: committeeOverview?.screeningPanel || 0,
      label: "Total Panelists",
      className: "red",
      color: "#d90429",
      icon: <FiClipboard />,
      bg: "#fff1f3",
    },
    {
      key: "compensationPanel",
      title: "Compensation Panel",
      value: committeeOverview?.compensationPanel || 0,
      label: "Total Panelists",
      className: "green",
      color: "#059669",
      icon: <FiUserCheck />,
      bg: "#ecfdf5",
    },
  ];

  return (
    <div className="committee-card mb-4">
      <div className="committee-header">
        <div className="committee-header-icon">
          <FiUsers />
        </div>

        <div>
          <h3>Committee</h3>
          <p>Panel Management & Overview</p>
        </div>
      </div>

      <div className="committee-grid">
        {committeeData.map((item) => (
          <div className={`committee-item ${item.className}`} key={item.title}>
            <div
              className="committee-icon"
              style={{
                background: item.bg,
                color: item.color,
              }}
            >
              {item.icon}
            </div>

            <h4>{item.title}</h4>

            <div className="committee-value" style={{ color: item.color }}>
              {item.value}
            </div>

            <span>{item.label}</span>
            <div className="committee-footer">
              <span
                style={{ color: item.color }}
                onClick={() => onCardClick(item.key)}
              >
                View Details
              </span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;
