import React from "react";
import { Modal, Table } from "react-bootstrap";
import "../../../style/css/ApprovalHistoryModal.css";

const ApprovalHistoryModal = ({ show, onClose, historyData }) => {
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
            Approvals History
          </Modal.Title>
          <p className="approval-history-subtitle">
            Track approvals and decisions
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
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
              {historyData?.length > 0 ? (
                historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.requester}</td>
                    <td>{item.requestDate}</td>
                    <td>{item.approver}</td>
                    <td>{item.approvalDate}</td>
                    <td>{item.status}</td>
                    <td>{item.comments}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No history available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApprovalHistoryModal;
