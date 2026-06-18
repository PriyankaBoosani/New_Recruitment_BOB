import React from "react";
import "../../../style/css/Dashboard/requisitionstatus.css";
import { FiCheckCircle, FiClock, FiZap, FiXCircle } from "react-icons/fi";

const RequisitionStatus = ({ summary, onCardClick }) => {
  const data = [
    {
      key: "ApprovedRequisitions",
      label: "Approved Requisitions",
      value: (summary?.approvedRequisitions ?? 0).toLocaleString("en-IN"),
      color: "#16a34a",
      icon: <FiCheckCircle />,
    },
    {
      key: "PendingRequisitions",
      label: "Pending Requisitions",
      value: (summary?.pendingRequisitions ?? 0).toLocaleString("en-IN"),
      color: "#d97706",
      icon: <FiClock />,
    },
    {
      key: "ActiveRequisitions",
      label: "Active Requisitions",
      value: (summary?.activeRequisitions ?? 0).toLocaleString("en-IN"),
      color: "#0891b2",
      icon: <FiZap />,
    },
    {
      key: "ClosedRequisitions",
      label: "Closed Requisitions",
      value: (summary?.closedRequisitions ?? 0).toLocaleString("en-IN"),
      color: "#7c3aed",
      icon: <FiXCircle />,
    },
  ];
  return (
    <div className="req-status-card">
      <div className="req-status-header">
        <h4>Requisition Status Overview</h4>
        <p>Current status breakdown</p>
      </div>

      <div className="req-status-grid">
        {data.map((item) => (
          <div
            key={item.label}
            className="req-status-item"
            style={{ borderTopColor: item.color }}
            onClick={() => onCardClick?.(item.key)}
          >
            <div
              className="req-status-icon"
              style={{
                color: item.color,
                background: `${item.color}15`,
              }}
            >
              {item.icon}
            </div>

            <h2 style={{ color: item.color }}>{item.value}</h2>

            <span>{item.label}</span>
            <div
              className="req-details-hover"
              style={{
                color: item.color,
              }}
            >
              Details →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequisitionStatus;
