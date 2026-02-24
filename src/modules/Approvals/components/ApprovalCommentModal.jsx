// src/components/ApprovalCommentModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../../../style/css/ApprovalCommentModal.css";

const ApprovalCommentModal = ({ show, actionType, onClose, onConfirm }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setComment("");
      setError("");
    }
  }, [show]);
  const handleConfirm = () => {
  const trimmedComment = comment.trimStart();

  // Empty check
  if (!trimmedComment.trim()) {
    setError("Comment is required");
    return;
  }

  // Leading space check
  if (comment.startsWith(" ")) {
    setError("Comment should not start with space");
    return;
  }

  // Max length check
  if (comment.length > 200) {
    setError("Comment should not exceed 200 characters");
    return;
  }

  // Success
  setError("");
  onConfirm(trimmedComment);
};


  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="approval-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          Approval / Rejection Comments
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        <Form.Group>
          <Form.Label className="comment-label">Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter Comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            isInvalid={!!error}
            className="comment-textarea"
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="" className="btn-cancel" onClick={onClose}>
          Cancel
        </Button>

        <Button variant=""
          className={
            actionType === "approve" ? "btn-approve" : "btn-reject"
          }
          onClick={handleConfirm}
        >
          {actionType === "approve" ? "Approve" : "Reject"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApprovalCommentModal;
