// src/modules/master/pages/JobGrade/components/JobGradeFormModal.jsx

import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import JobGradeImportModal from './JobGradeImportModal';

const JobGradeFormModal = ({
  show,
  onHide,
  isEditing,
   isViewing, 
  activeTab,
  setActiveTab,
  formData,
  handleInputChange,
  errors,
  handleSave,
  handleImport,
  editingId,      
  t,
  ...importProps
}) => {
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

      {!isViewing && (
  <p className="mb-0 small text-muted para">
    {t("choose_add_method")}
  </p>
)}


        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
       {!isViewing && (
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
                     {t("scale")} <span className="text-danger">*</span>
                   </Form.Label>
                {isViewing ? (
  <div className="form-control-view">
    {formData.scale || "-"}
  </div>
) : (
  <Form.Control
    name="scale"
    value={formData.scale}
    onChange={handleInputChange}
    className="form-control-custom"
    placeholder={t("jobGrade:enter_scale")}
  />
)}

{!isViewing && <ErrorMessage>{errors.scale}</ErrorMessage>}

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                   <Form.Label>
                      {t("gradeCode")} <span className="text-danger">*</span>
                   </Form.Label>
                  
               {isViewing ? (
  <div className="form-control-view">
    {formData.gradeCode || "-"}
  </div>
) : (
  <Form.Control
    name="gradeCode"
    value={formData.gradeCode}
    onChange={handleInputChange}
    className="form-control-custom"
    placeholder={t("jobGrade:enter_grade_code")}
  />
)}
{!isViewing && <ErrorMessage>{errors.gradeCode}</ErrorMessage>}

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                   <Form.Label>
                      {t("minSalary")} <span className="text-danger">*</span>
                   </Form.Label>
                    
                {isViewing ? (
  <div className="form-control-view">
    {formData.minSalary || "-"}
  </div>
) : (
  <Form.Control
    name="minSalary"
    value={formData.minSalary}
    onChange={handleInputChange}
    className="form-control-custom"
    placeholder={t("jobGrade:enter_min_salary")}
  />
)}
{!isViewing && <ErrorMessage>{errors.minSalary}</ErrorMessage>}

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                   <Form.Label>
                     {t("maxSalary")} <span className="text-danger">*</span>
                   </Form.Label>
                  
                 {isViewing ? (
  <div className="form-control-view">
    {formData.maxSalary || "-"}
  </div>
) : (
  <Form.Control
    name="maxSalary"
    value={formData.maxSalary}
    onChange={handleInputChange}
    className="form-control-custom"
    placeholder={t("jobGrade:enter_max_salary")}
  />
)}
{!isViewing && <ErrorMessage>{errors.maxSalary}</ErrorMessage>}

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
    onChange={handleInputChange}
    className="form-control-custom"
    placeholder={t("jobGrade:enter_description")}
  />
)}
{!isViewing && <ErrorMessage>{errors.description}</ErrorMessage>}

                </Form.Group>
              </Col>
            </Row>

        <Modal.Footer className="px-0 pt-3 pb-0 modal-footer-custom">
  {isViewing ? (
    <Button variant="outline-secondary" onClick={onHide}>
      {t("close")}
    </Button>
  ) : (
    <>
      <Button variant="outline-secondary" onClick={onHide}>
        {t("cancel")}
      </Button>

      <Button variant="primary" type="submit">
        {t("save")}
      </Button>
    </>
  )}
</Modal.Footer>


          </Form>
        ) : (
          <>
            <JobGradeImportModal t={t} {...importProps}  
              onClose={onHide}  />  
            {/* <Modal.Footer className="px-0 modal-footer-custom">
              <Button variant="outline-secondary" onCli ck={onHide}>
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

export default JobGradeFormModal;
