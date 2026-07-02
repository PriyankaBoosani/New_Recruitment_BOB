import React from "react";
import { Modal, Button } from "react-bootstrap";
import FormBuilder from "./FormBuilder";
import { useState } from "react";

const FormBuilderModal = ({ show, onHide, value, onSave, isViewMode = false }) => {
  const [saveForm, setSaveForm] = useState(null);
  const handleSave = (schema) => {
    if (isViewMode) return;

    onSave(schema);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="f16 bluecol">Configure Additional Form</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <FormBuilder
          initialSchema={value}
          onSave={handleSave}
          isViewMode={isViewMode}
          registerSave={setSaveForm}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>

        {!isViewMode && (
          <Button variant="primary" onClick={() => saveForm && saveForm()}>
            Save Form
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FormBuilderModal;
