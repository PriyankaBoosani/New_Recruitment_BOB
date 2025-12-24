// components/DeleteConfirmModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";

const DeleteConfirmModal = ({ show, onHide, panel, onSuccess }) => {
  const confirmDelete = async () => {
    try {
      const res = await masterApiService.deleteInterviewPanel(panel.id);
      if (!res?.success) throw new Error();
      toast.success("Interview panel deleted");
      onSuccess();
      onHide();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{panel?.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
