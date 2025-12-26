import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmModal = ({ show, onHide, onConfirm, targetName, t }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>{t("confirm_delete")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{t("delete_confirm_msg")}</p>
      {targetName && <div className="p-2 bg-light border rounded"><strong>{targetName}</strong></div>}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>{t("cancel")}</Button>
      <Button variant="danger" onClick={onConfirm}>{t("delete")}</Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteConfirmModal;