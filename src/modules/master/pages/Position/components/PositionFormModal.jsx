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
  handleImport,

  /* ✅ DEFAULTS ADDED */
  departments = [],
  jobGrades = [],

  selectedCSVFile,
  selectedXLSXFile,
  onSelectCSV,
  onSelectXLSX,
  removeCSV,
  removeXLSX,
  t
}) => {

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal"
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
              <Col xs={12}>
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

              <Col xs={12} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("department")} <span className="text-danger">*</span>
                  </Form.Label>
                  {/* <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="">{t("select_department")}</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Form.Select> */}


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

              <Col xs={12} md={6}>
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

              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("description")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={t("enter_description")}
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
        ) : (
          <>
            <PositionImportModal
              t={t}
              selectedCSVFile={selectedCSVFile}
              selectedXLSXFile={selectedXLSXFile}
              onSelectCSV={onSelectCSV}
              onSelectXLSX={onSelectXLSX}
              removeCSV={removeCSV}
              removeXLSX={removeXLSX}
            />

            <Modal.Footer className="modal-footer-custom px-0">
              <Button variant="outline-secondary" onClick={onHide}>
                {t("cancel")}
              </Button>
              <Button variant="primary" onClick={handleImport}>
                {t("import")}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PositionFormModal;
