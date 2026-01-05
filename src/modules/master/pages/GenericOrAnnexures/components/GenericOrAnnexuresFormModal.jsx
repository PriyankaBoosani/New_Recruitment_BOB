import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";

const GenericOrAnnexuresFormModal = ({
  show,
  onHide,
  isEditing,
  isViewing,
  formData,
  handleInputChange,
  errors,
  handleSave
}) => {
  const { t } = useTranslation(["genericOrAnnexures"]);
  const isTypeSelected = !!formData?.type;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal"
    >
      {/* ===== HEADER ===== */}
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isViewing
              ? t("view", "View Generic / Annexures")
              : isEditing
              ? t("edit", "Edit Generic / Annexures")
              : t("add", "Add Generic / Annexures")}
          </Modal.Title>

          {!isViewing && (
            <p className="mb-0 small text-muted para">
              {t("choose_add_method", "Select type and upload PDF")}
            </p>
          )}
        </div>
      </Modal.Header>

      {/* ===== BODY ===== */}
      <Modal.Body className="p-4">
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
            {/* ===== TYPE FIELD (REQUIRED) ===== */}
            <Col xs={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  {t("type", "Type")}{" "}
                  {!isViewing && <span className="text-danger">*</span>}
                </Form.Label>

                {isViewing ? (
                  <div className="form-control-view">
                    {formData?.type || "-"}
                  </div>
                ) : (
                  <Form.Select
                    name="type"
                    value={formData?.type || ""}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="">
                      {t("select_type", "Select Type")}
                    </option>
                    <option value="Generic">
                      {t("generic", "Generic")}
                    </option>
                    <option value="Annexures">
                      {t("annexures", "Annexures")}
                    </option>
                  </Form.Select>
                )}

                {!isViewing && (
                  <ErrorMessage>{errors?.type}</ErrorMessage>
                )}
              </Form.Group>
            </Col>

            {/* ===== PDF UPLOAD (TEXT FIELD STYLE, REQUIRED) ===== */}
            <Col xs={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  {t("upload_pdf", "Upload PDF")}{" "}
                  {!isViewing && <span className="text-danger">*</span>}
                </Form.Label>

                {isViewing ? (
                  <div className="form-control-view">
                    {formData?.file?.name || "-"}
                  </div>
                ) : (
                  <>
                    {/* hidden file input */}
                    <input
                      type="file"
                      id="pdfUpload"
                      name="file"
                      accept="application/pdf"
                      hidden
                      disabled={!isTypeSelected}
                      onChange={handleInputChange}
                    />

                    {/* visible text-field style uploader */}
                    <div
                      className={`form-control-custom d-flex align-items-center justify-content-between ${
                        !isTypeSelected ? "disabled" : ""
                      }`}
                      style={{
                        cursor: isTypeSelected
                          ? "pointer"
                          : "not-allowed"
                      }}
                      onClick={() =>
                        isTypeSelected &&
                        document
                          .getElementById("pdfUpload")
                          .click()
                      }
                    >
                      <span className="text-muted">
                        {formData?.file?.name ||
                          t("upload_pdf", "Upload PDF")}
                      </span>
                      <Upload size={18} />
                    </div>

                   
                  </>
                )}

                {!isViewing && (
                  <ErrorMessage>{errors?.file}</ErrorMessage>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* ===== FOOTER ===== */}
          <Modal.Footer className="px-0 pt-3 pb-0 modal-footer-custom">
            <Button variant="outline-secondary" onClick={onHide}>
              {isViewing
                ? t("close", "Close")
                : t("cancel", "Cancel")}
            </Button>

            {!isViewing && (
              <Button variant="primary" type="submit">
                {isEditing
                  ? t("update", "Update")
                  : t("save", "Save")}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GenericOrAnnexuresFormModal;
