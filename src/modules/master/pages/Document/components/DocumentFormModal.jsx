// src/modules/master/pages/Document/components/DocumentFormModal.jsx

import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import DocumentImportModal from './DocumentImportModal';
import {
  handleValidatedInput,
  INPUT_PATTERNS
} from "../../../../../shared/utils/inputHandlers";

const DocumentFormModal = ({
  show,
  onHide,
  isEditing,
   isViewing,
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
//   const handleChange = (e) => {
//   const { name, value } = e.target;

//   setFormData(prev => ({
//     ...prev,
//     [name]: value
//   }));

//   //  clear error for this field only
//   if (errors[name]) {
//     setErrors(prev => ({
//       ...prev,
//       [name]: null
//     }));
//   }
// };
// const handleChange = (e) => {
//   handleGlobalInputChange({
//     e,
//     setFormData,
//     errors,
//     setErrors,
//     t,
//     context: "document" // 👈 THIS LINE
//   });
// };

  return (
   <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
                  <Modal.Title>
              {isViewing ? t("view") : isEditing ? t("edit") : t("added")}
            </Modal.Title>

      </Modal.Header>

      <Modal.Body className="p-4">
        {/* ✅ Manual Entry Form – shown by default */}
       <Form
  onSubmit={
    isViewing
      ? (e) => { e.preventDefault(); onHide(); }
      : handleSave
  }
>

          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  {t("document_name")} <span className="text-danger">*</span>
                </Form.Label>

               {isViewing ? (
  <div className="form-control-view">
    {formData.name || '-'}
  </div>
) : (
 <Form.Control
  name="name"
  value={formData.name}
  className="form-control-custom"
  placeholder={t("enter_document_name")}
  onChange={(e) =>
    handleValidatedInput({
      e,
      fieldName: "name",
      setFormData,
      setErrors,
      pattern: INPUT_PATTERNS.ALPHA_NUMERIC_SPACE,
      errorMessage: t("validation:no_special_chars")
    })
  }
/>

)}

{!isViewing && <ErrorMessage>{errors.name}</ErrorMessage>}

              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  {t("description")} <span className="text-danger">*</span>
                </Form.Label>
                {isViewing ? (
  <div className="form-control-view" style={{ whiteSpace: 'pre-line' }}>
    {formData.description || '-'}
  </div>
) : (
<Form.Control
  as="textarea"
  rows={3}
  name="description"
  value={formData.description}
  className="form-control-custom"
  placeholder={t("enter_description")}
  onChange={(e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // optional: clear only this field error
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }}
/>

)}

{!isViewing && <ErrorMessage>{errors.description}</ErrorMessage>}

              </Form.Group>
            </Col>
          </Row>

          <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
  <Button variant="outline-secondary" onClick={onHide}>
    {isViewing ? t("close") : t("cancel")}
  </Button>

  {!isViewing && (
    <Button variant="primary" type="submit">
      {isEditing ? t("update") : t("save")}
    </Button>
  )}
</Modal.Footer>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DocumentFormModal;
