import React from "react";
import { Modal, Table, Spinner } from "react-bootstrap";
import "../../../style/css/ApprovalHistoryModal.css";

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("en-GB");
};

const formatStatusLabel = (status = "") =>
  status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ApprovalHistoryModal = ({
  show,
  onClose,
  historyData = [],
  loading = false,
}) => {
  const historyArray = Array.isArray(historyData)
    ? historyData
    : [];

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      className="approval-history-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title className="approval-history-title">
            Approval History
          </Modal.Title>
          <p className="approval-history-subtitle">
            Track approvals and decisions
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="approval-history-table">
              <thead>
                <tr>

                  <th>Requester</th>
                  <th>Request Date</th>
                  <th>Approver</th>
                  <th>Approval Date</th>
                  <th>Status</th>
                  <th>Comments</th>
                </tr>

              </thead>

              <tbody>
                {historyArray.length > 0 ? (
                  [...historyArray]
                    .sort(
                      (a, b) =>
                        new Date(b.actionDate) -
                        new Date(a.actionDate)
                    )
                    .map((item) => (
                      <tr key={item.approvalId}>
                        {/* <td>{item.approverRole}</td> */}
                        <td>{item.requester}</td>
                        <td>{formatDateTime(item.actionDate)}</td>
                        <td></td>
                        <td></td>
                        <td>{formatStatusLabel(item.status)}</td>
                        <td>{item.comments || "-"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No history available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ApprovalHistoryModal;