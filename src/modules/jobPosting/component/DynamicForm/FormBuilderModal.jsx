import React from "react";
import { Modal, Button } from "react-bootstrap";
import FormBuilder from "./FormBuilder";

const FormBuilderModal = ({
  show,
  onHide,
  value,
  onSave,
}) => {
  const handleSave = (schema) => {
    onSave(schema);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Configure Additional Form</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <FormBuilder
          initialSchema={value}
          onSave={handleSave}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormBuilderModal;