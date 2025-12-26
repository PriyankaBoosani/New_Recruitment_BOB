// src/modules/master/pages/Position/components/PositionFormModal.jsx
import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import PositionImportModal from "./PositionImportModal";

const PositionFormModal = ({
  show,
  onHide,
  isEditing,
  activeTab,
  setActiveTab,
  formData,
  errors,
  handleInputChange,
  handleSave,

  /* ✅ DEFAULTS ADDED */
  departments = [],
  jobGrades = [],

  t
}) => {

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal pos"
      fullscreen="sm-down"
      scrollable
    >
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isEditing ? t("edit_position") : t("add_position")}
          </Modal.Title>
          <p className="mb-0 small text-muted para">
            {t("choose_add_method")}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
        {!isEditing && (
          <div className="tab-buttons mb-4">
            <Button
              variant={activeTab === "manual" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => setActiveTab("manual")}
            >
              {t("manual_entry")}
            </Button>

            <Button
              variant={activeTab === "import" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "import" ? "active" : ""}`}
              onClick={() => setActiveTab("import")}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {activeTab === "manual" ? (
          <Form onSubmit={handleSave} noValidate>
            <Row className="g-3">
              <Col xs={4}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("position_title")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_position_title")}
                  />
                  <ErrorMessage>{errors.title}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col xs={4} md={4}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("department")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="">{t("select_department")}</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Form.Select>

                  <ErrorMessage>{errors.departmentId}</ErrorMessage>


                </Form.Group>
              </Col>

              <Col xs={4} md={4}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("job_grade")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="jobGradeId"
                    value={formData.jobGradeId}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="">{t("select_job_grade")}</option>
                    {jobGrades.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.gradeCode}
                      </option>

                    ))}

                  </Form.Select>

                  <ErrorMessage>{errors.jobGradeId}</ErrorMessage>
                </Form.Group>
              </Col>
              
              <Col xs={6} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("mandatory_experience")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="mandatoryExperience"
                    value={formData.mandatoryExperience}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_mandatory_experience")}
                  />
                  <ErrorMessage>{errors.mandatoryExperience}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("preferred_experience")}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="preferredExperience"
                    value={formData.preferredExperience}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_preferred_experience")}
                  />
                  <ErrorMessage>{errors.preferredExperience}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col xs={6} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("mandatory_education")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="mandatoryEducation"
                    value={formData.mandatoryEducation}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_mandatory_education")}
                  />
                  <ErrorMessage>{errors.mandatoryEducation}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col xs={6} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("preferred_education")}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="preferredEducation"
                    value={formData.preferredEducation}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_preferred_education")}
                  />
                  <ErrorMessage>{errors.preferredEducation}</ErrorMessage>
                </Form.Group>
              </Col>




              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("roles_responsibilities")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="rolesResponsibilities"
                    value={formData.rolesResponsibilities}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_roles_responsibilities")}
                  />
                  <ErrorMessage>{errors.rolesResponsibilities}</ErrorMessage>
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

        ) : (
          <>
            <PositionImportModal
              t={t}
              onClose={onHide}
              onSuccess={() => {
                setActiveTab("manual");
              }}
            />
            
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PositionFormModal;
