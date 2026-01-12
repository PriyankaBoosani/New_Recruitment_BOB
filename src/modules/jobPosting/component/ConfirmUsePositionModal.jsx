// src/modules/jobPosting/component/ConfirmUsePositionModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmUsePositionModal = ({ show, onYes, onNo }) => {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body className="text-center p-4">
        <p className="mb-4 fw-semibold">
          We found relevant data for the selected position.
          <br />
          Would you like to use it?
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button variant="success" onClick={onYes}>
            Yes
          </Button>
          <Button variant="outline-secondary" onClick={onNo}>
            No
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmUsePositionModal;
