// src/modules/master/pages/Document/components/DocumentFormModal.jsx

import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import DocumentImportModal from './DocumentImportModal';

const DocumentFormModal = ({
  show,
  onHide,
  isEditing,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  errors,
  setErrors,
  handleSave,
  handleImport,
  t,
  ...importProps
}) => {
  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // ✅ clear error for this field only
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  }
};

  return (
   <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>
          {isEditing ? t("edit") : t("added")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* ✅ Manual Entry Form – shown by default */}
        <Form onSubmit={handleSave}>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  {t("document_name")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control-custom"
                />
                <ErrorMessage>{errors.name}</ErrorMessage>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  {t("description")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control-custom"
                />
                <ErrorMessage>{errors.description}</ErrorMessage>
              </Form.Group>
            </Col>
          </Row>

          <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
            <Button variant="outline-secondary" onClick={onHide}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? t("update") : t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DocumentFormModal;
