import React from "react";
import { Modal, Button } from "react-bootstrap";

const ErrorModal = ({ show, message, errors = [], onClose }) => {
  const hasErrors = Array.isArray(errors) && errors.length > 0;

  return (
    <Modal size="lg" show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
            {hasErrors ? (message || "Validation Failed") : "Alert"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* If error list exists */}
        {hasErrors ? (
          <ul className="mb-0 ps-3">
            {errors.map((err, index) => (
              <li key={index} className="mb-2 error-display">
                {err}
              </li>
            ))}
          </ul>
        ) : (
          // Fallback single message display
          <p className="mb-0">
            {message || "Something went wrong."}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
