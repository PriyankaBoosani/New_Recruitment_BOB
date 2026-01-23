import React from "react";
import { Modal, Button } from "react-bootstrap";
import pos_delete_icon from "../../../assets/pos_delete_icon.png";

const DeleteConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  itemLabel,
  loading = false
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" className="modalimport">
      <Modal.Header closeButton>
        <Modal.Title className="f16 bluecol">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center f14">
        <img
          src={pos_delete_icon}
          alt="delete"
          className="mb-3"
          style={{ width: 30 }}
        />

        <p className="mb-1">{message}</p>

        {itemLabel && (
          <strong className="text-danger d-block">{itemLabel}</strong>
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
          className="f14"
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
           className="f14"
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
