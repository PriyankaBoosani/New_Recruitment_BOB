import React from "react";
import { Modal, Button } from "react-bootstrap";
import pos_delete_icon from "../../../assets/pos_delete_icon.png";

const DeleteRequisitionModal = ({
  show,
  onClose,
  onConfirm,
  requisitionCode,
  loading = false
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Requisition</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <img
          src={pos_delete_icon}
          alt="delete"
          className="mb-3"
          style={{ width: 40 }}
        />

        <p className="mb-1">
          Are you sure you want to delete this requisition?
        </p>

        {requisitionCode && (
          <strong className="text-danger">{requisitionCode}</strong>
        )}

        <p className="text-muted mt-2">
          This action cannot be undone.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteRequisitionModal;
