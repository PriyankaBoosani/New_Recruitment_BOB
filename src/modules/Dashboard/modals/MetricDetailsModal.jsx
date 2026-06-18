import React from "react";
import { Modal } from "react-bootstrap";
import { FiDownload, FiX } from "react-icons/fi";
import "../../../style/css/Dashboard/MetricDetailsModal.css";
import useDashboardDownload from "../hooks/useDashboardDownload";
const MetricDetailsModal = ({
  show,
  onClose,
  metric,
  dashboardData,
  filters = {},
}) => {
    const { downloadReport, downloading } = useDashboardDownload();

  if (!metric) return null;

  const reportScreenMap = {
    vacancies: "TOTAL_VACANCIES",
    requisitions: "TOTAL_REQUISITIONS",
    departments: "TOTAL_DEPARTMENTS",
    positions: "TOTAL_POSITIONS",
    ApprovedRequisitions: "APPROVED_REQUISITIONS",
    PendingRequisitions: "PENDING_REQUISITIONS",
    ActiveRequisitions: "ACTIVE_REQUISITIONS",
    ClosedRequisitions: "CLOSED_REQUISITIONS",
  };

  const modalConfig = {
    vacancies: {
      title: "Total Vacancies",
      color: "#7C3AED",
      headerBg: "#FBF8FF",
      iconBg: "#F3EEFF",
      subtitle: "Detailed breakdown and metrics",
      columns: ["Requisition ID", "Department", "Position", "Vacancies"],
      data: dashboardData?.totalVacancies || [],
    },

    requisitions: {
      title: "Total Requisitions",
      color: "#003087",
      headerBg: "#FBFDFF",
      iconBg: "#EEF5FF",
      subtitle: "Detailed breakdown and metrics",
      columns: [
        "Requisition ID",
        "Department",
        "Total No Of Positions",
        "Vacancies",
      ],
      data: dashboardData?.totalRequisitions || [],
    },

    departments: {
      title: "Total Departments",
      color: "#C8102E",
      headerBg: "#FFF9F9",
      iconBg: "#FFF0F2",
      subtitle: "Detailed breakdown and metrics",
      columns: ["Department", "Positions Count"],
      data: dashboardData?.totalDepartments || [],
    },

    positions: {
      title: "Total Positions",
      color: "#059669",
      headerBg: "#F7FFFB",
      iconBg: "#ECFFF7",
      subtitle: "Detailed breakdown and metrics",
      columns: ["Requisition", "Department", "Position", "Vacancies", "Status"],
      data: dashboardData?.totalPositions || [],
    },
    ApprovedRequisitions: {
      title: "Approved Requisitions",
      color: "#059669",
      headerBg: "#F7FFFB",

      iconBg: "#ECFFF7",
      subtitle: "Approved requisition details",
      columns: ["Requisition", "Total No Of Positions", "Vacancies"],
      data: dashboardData?.approvedRequisitionDetails || [],
    },
    PendingRequisitions: {
      title: "Pending Requisitions",
      color: "#d97706",
      headerBg: "#FFF9F9",
      iconBg: "#FFF0F2",
      subtitle: "Pending requisition details",
      columns: ["Requisition", "Total No Of Positions", "Vacancies"],
      data: dashboardData?.pendingRequisitionDetails || [],
    },
    ActiveRequisitions: {
      title: "Active Requisitions",
      color: "#0891b2",
      headerBg: "#F0F9FF",
      iconBg: "#E6F4FF",
      subtitle: "Active requisition details",
      columns: ["Requisition", "Total No Of Positions", "Vacancies"],
      data: dashboardData?.activeRequisitionDetails || [],
    },
    ClosedRequisitions: {
      title: "Closed Requisitions",
      color: "#7c3aed",
      headerBg: "#F9F5FF",
      iconBg: "#F3EEFF",
      subtitle: "Closed requisition details",
      columns: ["Requisition", "Total No Of Positions"],
      data: dashboardData?.closedRequisitionDetails || [],
    },
  };

  const config = modalConfig[metric];

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
      backdrop="static"
      className="metric-details-modal"
    >
      <Modal.Body className="p-0">
        <div
          className="metric-modal-header"
          style={{
            background: config.headerBg,
          }}
        >
          <div>
            <h4
              className="mb-1"
              style={{
                color: config.color,
                fontWeight: 700,
              }}
            >
              {config.title}
            </h4>
            <span
              style={{
                color: "#64748b",
              }}
            >
              {config.subtitle}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className="pdf-btn btn btn-primary"
              style={{
                background: "#fff",
                border: `1px solid ${config.color}20`,
                color: config.color,
              }}
              disabled={downloading}
              onClick={() =>
                downloadReport({
                  filters,
                  extension: ".pdf",
                  reportScreen: reportScreenMap[metric],
                })
              }
            >
              <FiDownload />
              <span className="ms-2">
                {downloading ? "Downloading..." : "Export Pdf"}
              </span>
            </button>

            <button
              className="excel-btn btn btn-primary"
              style={{
                background: "#fff",
                border: `1px solid ${config.color}20`,
                color: config.color,
              }}
              disabled={downloading}
              onClick={() =>
                downloadReport({
                  filters,
                  extension: ".xlsx",
                  reportScreen: reportScreenMap[metric],
                })
              }
            >
              <FiDownload />
              <span className="ms-2">
                {downloading ? "Downloading..." : "Export Excel"}
              </span>
            </button>

            <FiX size={24} style={{ cursor: "pointer" }} onClick={onClose} />
          </div>
        </div>

        <div className="p-4">
          <table className="metrictable">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th
                    style={{
                      background: config.headerBg,
                    }}
                    key={column}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {config.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MetricDetailsModal;
