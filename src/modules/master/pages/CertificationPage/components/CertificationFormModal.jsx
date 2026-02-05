// src/modules/master/pages/Certification/components/CertificationFormModal.jsx

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { handleValidatedInput, INPUT_PATTERNS } from "../../../../../shared/utils/inputHandlers";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import CertificationImportModal from "./CertificationImportModal";
import { validateCertificationForm } from "../../../../../shared/utils/certification-validations";

const EMPTY_FORM = {
  name: "",
  description: ""
};

const CertificationFormModal = ({
  show,
  onHide,
  isEditing,
  isViewing,
  editingCertification,
  onSave,
  onUpdate,
  onImport,
  certifications = [],
  onSuccess
}) => {
  const { t } = useTranslation(["certification"]);

  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  /* ---------------- LOAD / RESET FORM DATA ---------------- */
  useEffect(() => {
    if (!show) return;

    if (isEditing || isViewing) {
      setFormData({
        name: editingCertification?.name ?? "",
        description: editingCertification?.description ?? ""
      });
    } else {
      //  ADD MODE → always reset
      setFormData(EMPTY_FORM);
    }

    setErrors({});
    setActiveTab("manual");
  }, [show, isEditing, isViewing, editingCertification]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { valid, errors: vErrors } = validateCertificationForm(formData, {
      existing: certifications,
      currentId: isEditing ? editingCertification?.id : null
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    if (isEditing) {
      onUpdate(editingCertification.id, formData);
    } else {
      onSave(formData);
    }

    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal"
    >
      {/* ---------------- HEADER ---------------- */}
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isViewing
              ? t("view_certification")
              : isEditing
                ? t("edit_certification")
                : t("add_certification")}
          </Modal.Title>

          {!isEditing && !isViewing && (
            <p className="mb-0 small text-muted">
              {t("choose_add_method")}
            </p>
          )}
        </div>
      </Modal.Header>

      {/* ---------------- BODY ---------------- */}
      <Modal.Body className="p-4">

        {/* -------- Tabs (Add Only) -------- */}
        {!isEditing && !isViewing && (
          <div className="tab-buttons mb-4">
            <Button
              variant={activeTab === "manual" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "manual" ? "active" : ""
                }`}
              onClick={() => setActiveTab("manual")}
            >
              {t("manual_entry")}
            </Button>

            <Button
              variant={activeTab === "import" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "import" ? "active" : ""
                }`}
              onClick={() => setActiveTab("import")}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {/* -------- MANUAL ENTRY -------- */}
        {activeTab === "manual" ? (
          <Form
            onSubmit={
              isViewing
                ? (e) => {
                  e.preventDefault();
                  onHide();
                }
                : handleSubmit
            }
            noValidate
          >
            <Row className="g-3">
              <Col md={12}>
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
                    maxLength={200}
                    value={formData.name}
                    placeholder={t("enter_name")}
                    className="form-control-custom"
                    onChange={(e) =>
                      handleValidatedInput({
                        e,
                        fieldName: "name",
                        setFormData,
                        setErrors,
                        pattern: INPUT_PATTERNS.ALPHA_NUMERIC_SPACE_ambersent_Dash_underscore_at,
                        errorMessage: t("validation:no_special_charsess")
                      })
                    }
                  />
                )}

                {!isViewing && (
                  <ErrorMessage>{errors.name}</ErrorMessage>
                )}
              </Col>

              <Col md={12}>
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
                    maxLength={2000}
                    name="description"
                    value={formData.description}
                    placeholder={t("enter_description")}
                    className="form-control-custom"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        description: value
                      }));
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.description;
                        return copy;
                      });
                    }}
                  />
                )}

                {!isViewing && (
                  <ErrorMessage>{errors.description}</ErrorMessage>
                )}
              </Col>

            </Row>

            {/* -------- FOOTER -------- */}
            <Modal.Footer className="px-0 pt-4 modal-footer-custom">
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
          /* -------- IMPORT TAB -------- */
          <CertificationImportModal
            onImport={onImport}
            onClose={onHide}
            onSuccess={onSuccess}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CertificationFormModal;
