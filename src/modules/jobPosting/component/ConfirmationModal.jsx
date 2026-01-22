import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  itemLabel,
  icon,
  confirmText = "Confirm",
  confirmVariant = "primary",
  loading = false,
  showWarning = false
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {icon && (
          <img
            src={icon}
            alt="icon"
            className="mb-3"
            style={{ width: 40 }}
          />
        )}

        <p className="mb-1">{message}</p>

        {itemLabel && (
          <strong className="d-block">{itemLabel}</strong>
        )}

        {showWarning && (
          <p className="text-muted mt-2">
            This action cannot be undone.
          </p>
        )}
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
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
