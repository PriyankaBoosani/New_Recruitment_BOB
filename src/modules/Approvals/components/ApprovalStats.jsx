import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ApprovalStats({
  total,
  approved,
  rejected,
  approvedLabel,
  rejectedLabel,
  workflowStatus,
  onApprove,
  onReject,
  onDownload,
}) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          className: "approve",
          icon: "✓",
          label: "Approved",
        };

      case "REJECTED":
        return {
          className: "danger",
          icon: "✕",
          label: "Rejected",
        };

      case "PENDING":
        return {
          className: "warning",
          icon: "⏳",
          label: "Pending",
        };
        case "L1_PENDING":
        return {
          className: "warning",
          icon: "⏳",
          label: "L1 Pending",
        };
        

      default:
        return {
          className: "nothing",
          icon: "-",
          label: status || "-",
        };
    }
  };

  const status = getStatusConfig(workflowStatus);
  const isActionAllowed = workflowStatus === "L1_PENDING";

  return (
    <div className="stats-row">
      <div className="stats-card">
        <div>
          <div className="stat-label">Total Candidates in Position</div>
          <div className="stat-value">{total}</div>
        </div>

        <div className="stat-icon neutral">👤</div>
      </div>

      <div className="stats-card shortlisted">
        <div>
          <div className="stat-label">{approvedLabel}</div>
          <div className="stat-value">{approved}</div>
        </div>

        <div className="stat-icon success">✓</div>
      </div>

      <div className="stats-card rejected">
        <div>
          <div className="stat-label">{rejectedLabel}</div>
          <div className="stat-value">{rejected}</div>
        </div>

        <div className="stat-icon danger">✕</div>
      </div>
      <div className="stats-card">
        <div>
          <div className="stat-label">Batch Status</div>
          <div className={`stat-value ${status.className}`}>{status.label}</div>
        </div>

        <div className={`stat-icon ${status.className}`}>{status.icon}</div>
      </div>

      <div
        className="stats-card download-card"
        onClick={onDownload}
        style={{ cursor: "pointer" }}
      >
        <div>
          <div className="stat-label">Download</div>
          <div className="stat-value">PDF</div>
        </div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="download-tooltip">Download PDF</Tooltip>}
        >
          <div className="stat-icon info">
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </OverlayTrigger>
      </div>

      <div className="action-row action-block">
        <button
          className="btn reject-btn"
          onClick={onReject}
          disabled={!isActionAllowed}
        >
          Reject
        </button>

        <button
          className="btn approve-btn"
          onClick={onApprove}
          disabled={!isActionAllowed}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
