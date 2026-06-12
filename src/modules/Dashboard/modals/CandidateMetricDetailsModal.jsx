import React from "react";
import { Modal } from "react-bootstrap";
import { FiDownload, FiX } from "react-icons/fi";
import "../../../style/css/Dashboard/MetricDetailsModal.css";
const CandidateMetricDetailsModal = ({
  show,
  onClose,
  metric,
  pipelineDetails = [],
}) => {
  if (!metric) return null;

  const modalConfig = {
    totalVacancies: {
      title: "Total Vacancies",
      color: "#E11D48",
      headerBg: "#FFF8FA",
      subtitle: "Detailed vacancy breakdown",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    applicationsReceived: {
      title: "Applications Received",
      color: "#F97316",
      headerBg: "#FFF8F2",
      subtitle: "Application details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    shortlistedCandidates: {
      title: "Shortlisted Candidates",
      color: "#2563EB",
      headerBg: "#F5F9FF",
      subtitle: "Shortlisted candidate details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    rejectedCandidates: {
      title: "Rejected Candidates",
      color: "#EF4444",
      headerBg: "#FFF7F7",
      subtitle: "Rejected candidate details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    pendingCandidates: {
      title: "Pending Candidates",
      color: "#F59E0B",
      headerBg: "#FFFDF5",
      subtitle: "Pending applications",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    interviewsScheduled: {
      title: "Interviews Scheduled",
      color: "#8B5CF6",
      headerBg: "#FAF8FF",
      subtitle: "Interview schedule details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    interviewsCompleted: {
      title: "Interviews Completed",
      color: "#10B981",
      headerBg: "#F7FCF9",
      subtitle: "Completed interviews",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    qualified: {
      title: "Qualified Candidates",
      color: "#0891B2",
      headerBg: "#F5FCFF",
      subtitle: "Qualified candidate details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    offersSent: {
      title: "Offers Sent",
      color: "#0891B2",
      headerBg: "#F5FCFF",
      subtitle: "Offer details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    offerAccepted: {
      title: "Offer Accepted",
      color: "#10B981",
      headerBg: "#F7FCF9",
      subtitle: "Accepted offers",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    offerRejected: {
      title: "Offer Rejected",
      color: "#EF4444",
      headerBg: "#FFF8F8",
      subtitle: "Rejected offers",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },

    joined: {
      title: "Joined Candidates",
      color: "#10B981",
      headerBg: "#F7FCF9",
      subtitle: "Employee joining details",
      columns: ["Requisition ID", "Department", "Position", "Count"],
    },
  };
  const metricFieldMap = {
    totalVacancies: "vacancyCount",
    applicationsReceived: "applicationsReceived",
    shortlistedCandidates: "shortlistedCandidates",
    rejectedCandidates: "rejectedCandidates",
    pendingCandidates: "pendingCandidates",
    interviewsScheduled: "interviewsScheduled",
    interviewsCompleted: "interviewsCompleted",
    qualified: "qualified",
    offersSent: "offersSent",
    offerAccepted: "offerAccepted",
    offerRejected: "offerRejected",
    joined: "joined",
  };

  const config = modalConfig[metric];
  const metricField = metricFieldMap[metric];

  const tableData = pipelineDetails
    .filter((item) => (item[metricField] || 0) > 0)
    .map((item) => ({
      requisitionId: item.requisitionId,
      department: item.department,
      position: item.position,
      count: item[metricField],
    }));

  if (!config) return null;

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
          style={{ background: config.headerBg }}
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

            <span>{config.subtitle}</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className="pdf-btn btn btn-primary"
              style={{
                background: "#fff",
                color: config.color,
              }}
            >
              <FiDownload />
              <span className="ms-2">Export PDF</span>
            </button>

            <button
              className="excel-btn btn btn-primary"
              style={{
                background: "#fff",
                color: config.color,
              }}
            >
              <FiDownload />
              <span className="ms-2">Export Excel</span>
            </button>

            <FiX size={22} onClick={onClose} style={{ cursor: "pointer" }} />
          </div>
        </div>

        <div className="p-4">
          <table className="metrictable">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      background: config.headerBg,
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.requisitionId}</td>
                    <td>{row.department}</td>
                    <td>{row.position}</td>
                    <td>{row.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CandidateMetricDetailsModal;
