// src/modules/master/pages/Department/components/DeleteConfirmModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ show, onHide, onConfirm, target }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="delete-confirm-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to delete this item?</p>
        {target && (
          <div className="delete-confirm-user">
            <strong>{target.name}</strong>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
