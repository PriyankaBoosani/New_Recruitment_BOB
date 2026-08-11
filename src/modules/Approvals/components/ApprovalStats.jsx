import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";


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
          label: "-",
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
  const { t } = useTranslation("approvalHistory");


  return (
    <div className="stats-row">
      <div className="stats-card">
        <div>
          <div className="stat-label">{t("total_candidates_in_position")}</div>
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
          <div className="stat-label">{t("batch_status")}</div>
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
          <div className="stat-label">{t("download")}</div>
          <div className="stat-value">{t("PDF")}</div>
        </div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="download-tooltip">{t("download")} {t("PDF")}</Tooltip>}
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
          {t("reject")}
        </button>

        <button
          className="btn approve-btn"
          onClick={onApprove}
          disabled={!isActionAllowed}
        >
          {t("approve")}
        </button>
      </div>
    </div>
  );
}
