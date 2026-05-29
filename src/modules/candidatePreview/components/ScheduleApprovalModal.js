import React from "react";
import { Modal } from "react-bootstrap";

const ScheduleApprovalModal = ({
  show,
  onClose,
  onApprove,
  loading
}) => {

  return (

    <Modal
      show={show}
      centered
      onHide={onClose}
      className="schedule-approval-modal"
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Submit For Approval
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        Please review the scheduled details before submitting for approval.

      </Modal.Body>

      <Modal.Footer>

        <button
          className="btn btn-light"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={onApprove}
        >
          {loading
            ? "Submitting..."
            : "Submit"}
        </button>

      </Modal.Footer>

    </Modal>

  );

};

export default ScheduleApprovalModal;