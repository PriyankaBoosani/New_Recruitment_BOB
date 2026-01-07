import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import DepartmentImportView from '../components/DepartmentImportModal';
import { handleValidatedInput, INPUT_PATTERNS } 
from '../../../../../shared/utils/inputHandlers';



const DepartmentFormModal = ({
  show,
  onHide,
  isEditing,
  isViewing,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  handleInputChange,
  errors,
  setErrors,
  handleSave,
  t,
  ...importProps
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isViewing ? t("viewDepartment") : isEditing ? t("editDepartment") : t("addDepartment")}
          </Modal.Title>
          {!isViewing && (
            <p className="mb-0 small text-muted para">
              {t("choose_add_method")}
            </p>
          )}
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
          <Form onSubmit={isViewing ? (e) => { e.preventDefault(); onHide(); } : handleSave}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group className="form-group">
  <Form.Label>
    {t("name")} {!isViewing && <span className="text-danger">*</span>}
  </Form.Label>

  {isViewing ? (
    <div className="form-control-view">
      {formData.name || "-"}
    </div>
  ) : (
<Form.Control
  name="name"
  value={formData.name}
  className="form-control-custom"
  placeholder={t("department:enterName")}
  onChange={(e) =>
    handleValidatedInput({
      e,
      fieldName: "name",
      setFormData,
      setErrors,
      pattern: INPUT_PATTERNS.ALPHA_NUMERIC_SPACE_ambersent_Dash_underscore_at,
      errorMessage: t("validation:no_special_charss")
    })
  }
/>




  )}

  {!isViewing && <ErrorMessage>{errors.name}</ErrorMessage>}
</Form.Group>

              </Col>

              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label className={isViewing ? '' : ''}>
                    {t("description")} {!isViewing && <span className="text-danger">*</span>}
                  </Form.Label>
                  {isViewing ? (
                    <div className="form-control-view" style={{ whiteSpace: 'pre-line' }}>
                      {formData.description || '-'}
                    </div>
                  ) : (
//                   <Form.Control
//   as="textarea"
//   rows={3}
//   name="description"
//   className="form-control-custom"
//   value={formData.description}
//   placeholder={t("department:enterDescription")}
//   readOnly={isViewing}
//   onChange={(e) => {
//     const value = e.target.value;

//     // ❌ block non-alphabets
//     if (!/^[A-Za-z\s]*$/.test(value)) {
//       setErrors(prev => ({
//         ...prev,
//         description: t("validation:no_special_chars")
//       }));
//       return;
//     }

//     // ✅ clear error when valid
//     setErrors(prev => {
//       const copy = { ...prev };
//       delete copy.description;
//       return copy;
//     });

//     handleInputChange(e);
//   }}
// />

//                   )}
//                   {!isViewing && <ErrorMessage>{errors.description}</ErrorMessage>}
//                 </Form.Group>
//               </Col>
//             </Row>



  <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      className="form-control-custom"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t("department:enterDescription")}
                      readOnly={isViewing}
                    />
                  )}
                  {!isViewing && <ErrorMessage>{errors.description}</ErrorMessage>}
                </Form.Group>
              </Col>
            </Row>

            <Modal.Footer className="px-0 pt-3 pb-0 modal-footer-custom">
              <Button variant="outline-secondary" onClick={onHide}>
                {isViewing ? t("close") : t("cancel")}
              </Button>
              {!isViewing && (
                <Button variant="primary" type="submit">
                  {isEditing ? t("updateDepartment") : t("save")}
                </Button>
              )}
            </Modal.Footer>
          </Form>
        ) : (
          <>
            {/* Import view handles upload internally */}
            <DepartmentImportView
              t={t}
              onClose={onHide}
              onSuccess={importProps.onSuccess}
            />

          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DepartmentFormModal;
