import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import LocationImportModal from "./LocationImportModal";

const LocationFormModal = ({
  show,
  onHide,
  isEditing,
  isViewing,            // ✅ VIEW MODE
  formData,
  setFormData,
  errors,
  cities,
  setErrors,
  handleSave,
  t,
  ...importProps
}) => {
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(() => {
    setActiveTab("manual");
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cityId") {
      const selectedCity = cities.find(
        (c) => String(c.id) === String(value)
      );

      setFormData((prev) => ({
        ...prev,
        cityId: value,
        cityName: selectedCity?.name || "",
      }));

      setErrors((prev) => ({ ...prev, cityId: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal"
      scrollable
    >
      {/* ===== HEADER ===== */}
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isViewing ? t("view") : isEditing ? t("edit") : t("addd")}
          </Modal.Title>

          {!isEditing && !isViewing && (
            <p className="mb-0 small text-muted para">
              {t("choose_add_method")}
            </p>
          )}
        </div>
      </Modal.Header>

      {/* ===== BODY ===== */}
      <Modal.Body className="p-4">
        {/* Tabs hidden in View */}
        {!isEditing && !isViewing && (
          <div className="tab-buttons mb-4">
            <Button
              variant={activeTab === "manual" ? "light" : "outline-light"}
              className={`tab-button ${
                activeTab === "manual" ? "active" : ""
              }`}
              onClick={() => setActiveTab("manual")}
            >
              {t("manual_entry")}
            </Button>

            <Button
              variant={activeTab === "import" ? "light" : "outline-light"}
              className={`tab-button ${
                activeTab === "import" ? "active" : ""
              }`}
              onClick={() => setActiveTab("import")}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {/* ===== MANUAL TAB ===== */}
        {activeTab === "manual" ? (
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
              {/* CITY */}
              <Col xs={12} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("city_name")} {!isViewing && <span className="text-danger">*</span>}
                  </Form.Label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {formData.cityName || "-"}
                    </div>
                  ) : (
                    <Form.Select
                      name="cityId"
                      value={formData.cityId || ""}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    >
                      <option value="">{t("select_city")}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}

                  {!isViewing && <ErrorMessage>{errors.cityId}</ErrorMessage>}
                </Form.Group>
              </Col>

              {/* LOCATION NAME */}
              <Col xs={12} md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("location_name")} {!isViewing && <span className="text-danger">*</span>}
                  </Form.Label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {formData.name || "-"}
                    </div>
                  ) : (
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("enter_location_name")}
                      className="form-control-custom"
                    />
                  )}

                  {!isViewing && <ErrorMessage>{errors.name}</ErrorMessage>}
                </Form.Group>
              </Col>
            </Row>

            {/* ===== FOOTER ===== */}
            <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
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
                    {isEditing ? t("update") : t("save")}
                  </Button>
                </>
              )}
            </Modal.Footer>
          </Form>
        ) : (
          /* ===== IMPORT TAB ===== */
          <LocationImportModal
            t={t}
            onClose={onHide}
            onSuccess={importProps.onSuccess}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LocationFormModal;
