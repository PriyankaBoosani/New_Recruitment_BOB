import React from "react";
import { Modal, Button } from "react-bootstrap";

const ErrorModal = ({ show, message, errors = [], onClose }) => {
  console.log("errors", errors);
  return (
    <Modal size="lg" show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          {message || "Validation failed"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
       <ul className="mb-0 ps-3">
            {errors.map((err, index) => (
              <li key={index} className="mb-2">
                {err}
              </li>
            ))}
          </ul>
      </Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
