import React from "react";
import { Modal } from "react-bootstrap";
import { FiDownload, FiX } from "react-icons/fi";
import "../../../style/css/Dashboard/MetricDetailsModal.css"

const CommitteeDetailsModal = ({ show, onClose, metric, committeeData }) => {
  if (!metric) return null;

  const modalConfig = {
    interviewPanel: {
      title: "Interview Panel",
      color: "#003B95",
      headerBg: "#EEF5FF",
      subtitle: "Interview panel member details",
      columns: ["Name", "Total No Of Position Assigned", "No of Days"],
      data: committeeData?.interviewPanels || [],
    },

    screeningPanel: {
      title: "Screening Panel",
      color: "#d90429",
      headerBg: "#FFF5F6",
      subtitle: "Screening panel member details",
      columns: ["Name", "Total No Of Position Assigned", "No of Days"],
      data: committeeData?.screeningPanels || [],
    },

    compensationPanel: {
      title: "Compensation Panel",
      color: "#059669",
      headerBg: "#F0FDF4",
      subtitle: "Compensation panel member details",
      columns: ["Name", "Total No Of Position Assigned", "No of Days"],
      data: committeeData?.compensationPanels || [],
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

            <span style={{ color: "#64748b" }}>{config.subtitle}</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className="pdf-btn btn btn-primary"
              style={{
                background: "#fff",
                border: `1px solid ${config.color}20`,
                color: config.color,
              }}
            >
              <FiDownload />
              <span className="ms-2">Export Pdf</span>
            </button>

            <button
              className="excel-btn btn btn-primary"
              style={{
                background: "#fff",
                border: `1px solid ${config.color}20`,
                color: config.color,
              }}
            >
              <FiDownload />
              <span className="ms-2">Export Excel</span>
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

export default CommitteeDetailsModal;
