// src/modules/master/pages/SpecialCategory/components/SpecialCategoryFormModal.jsx
import { handleGlobalInputChange } from "../../../../../shared/utils/inputHandlers";


import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import SpecialCategoryImportModal from './SpecialCategoryImportModal';

const SpecialCategoryFormModal = ({
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

//   // ✅ clear error for this field only
//   if (errors[name]) {
//     setErrors(prev => ({
//       ...prev,
//       [name]: null
//     }));
//   }
// };
const handleChange = (e) => {
  handleGlobalInputChange({
    e,
    setFormData,
    errors,
    setErrors,
    t
  });
};



  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div>
              <Modal.Title>
        {isViewing
          ? t("view")
          : isEditing
          ? t("edit")
          : t("added")}
      </Modal.Title>


          <p className="small text-muted para">
              {isViewing
           ? null
           :  t("choose_add_method")}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
       {!isEditing && !isViewing && (
          <div className="tab-buttons mb-4">
            <Button
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              variant={activeTab === 'manual' ? 'light' : 'outline-light'}
              onClick={() => setActiveTab('manual')}
            >
              {t("manual_entry")}
            </Button>

            <Button
              className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
              variant={activeTab === 'import' ? 'light' : 'outline-light'}
              onClick={() => setActiveTab('import')}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {activeTab === 'manual' ? (
         <Form
  onSubmit={
    isViewing
      ? (e) => {
          e.preventDefault();
          onHide();
        }
      : handleSave
  }
>

            <Row className="g-3">
            <Col md={6}>
  <Form.Group>
    <Form.Label>
      {t("code")} <span className="text-danger">*</span>
    </Form.Label>

    {isViewing ? (
      <div className="form-control-view">
        {formData.code || "-"}
      </div>
    ) : (
      <Form.Control
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder={t("enter_code")}
        className="form-control-custom"
      />
    )}

    {!isViewing && <ErrorMessage>{errors.code}</ErrorMessage>}
  </Form.Group>
</Col>


            <Col md={6}>
  <Form.Group>
    <Form.Label>
      {t("name")} <span className="text-danger">*</span>
    </Form.Label>

    {isViewing ? (
      <div className="form-control-view">
        {formData.name || "-"}
      </div>
    ) : (
      <Form.Control
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={t("enter_name")}
        className="form-control-custom"
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
      <div
        className="form-control-view"
        style={{ whiteSpace: "pre-line" }}
      >
        {formData.description || "-"}
      </div>
    ) : (
      <Form.Control
        as="textarea"
        rows={3}
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder={t("enter_description")}
        className="form-control-custom"
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
        ) : (
          <>
            <SpecialCategoryImportModal t={t} onClose={onHide} onSuccess={importProps.onSuccess}   />
            {/* <Modal.Footer className="modal-footer-custom px-0">
              <Button variant="outline-secondary" onClick={onHide}>
                {t("cancel")}
              </Button>
              <Button variant="primary" onClick={handleImport}>
                {t("import")}
              </Button>
            </Modal.Footer> */}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SpecialCategoryFormModal;
