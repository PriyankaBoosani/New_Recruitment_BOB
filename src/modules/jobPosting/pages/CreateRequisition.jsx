import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import "../../../style/css/CreateRequisition.css";

import ErrorMessage from "../../../shared/components/ErrorMessage";
import { validateRequisitionForm, validateTitleOnType, normalizeTitle } from "../validations/requisition-validation";
import { mapRequisitionToApi } from "../mappers/createRequisitionMapper";
import { useCreateRequisition } from "../hooks/useCreateRequisition";
import { REQUISITION_CONFIG } from "../config/requisitionConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


const CreateRequisition = () => {
  const { t } = useTranslation(["CreateRequisition", "common"]);
  const renderError = (err) => (err ? t(err) : "");


  const navigate = useNavigate();
  const location = useLocation();

  /* ===================== URL + MODE ===================== */
  const query = new URLSearchParams(location.search);
  const editId = query.get("id"); //  DEFINE FIRST
  const mode = location.state?.mode; // "view" | "edit" | undefined

  const isViewMode = !!editId && mode === "view";

  /* ===================== HOOK ===================== */
  const {
    formData,
    handleInputChange,
    saveRequisition,
    loading,
    fetching,
    error: apiError
  } = useCreateRequisition(editId);

  const [errors, setErrors] = useState({});
  /* ===================== SAVE ===================== */
  const handleSave = async (e) => {
    e?.preventDefault?.();

    const { valid, errors: valErrors } = validateRequisitionForm(
      formData,
      Boolean(editId)
    );

    if (!valid) {
      setErrors(valErrors);
      return;
    }

    if (isViewMode) return;

    try {
      const payload = mapRequisitionToApi(formData);
      await saveRequisition(payload);
      toast.success(
        editId
          ? t("update_success")
          : t("create_success")
      );

      navigate(REQUISITION_CONFIG.SUCCESS_REDIRECT);
    } catch (err) {
      console.error("Save failed", err);
    }
  };
  function getTomorrowISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }
  function addCalendarDays(startDate, days) {
    if (!startDate) return "";

    const date = new Date(startDate);

    // 🔒 guard clause — NEVER do math on invalid dates
    if (isNaN(date.getTime())) {
      return "";
    }

    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  }


  /* ===================== LOADER ===================== */
  if (fetching) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>{t("loading")}</p>
      </Container>
    );
  }

  /* ===================== UI ===================== */
  return (
    <Container fluid className="create-requisition-page">
      <Card className="requisition-card">
        <Card.Body>
          <div className="section-title">
            <span className="indicator" />
            <h6>
              {isViewMode
                ? t("view_requisition")
                : editId
                  ? t("edit_requisition")
                  : t("create_requisition")}
            </h6>
          </div>

          <Form onSubmit={handleSave}>
            {/*  THIS WAS MISSING */}
            <fieldset disabled={isViewMode}>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>
                  {t("requisition_title")} <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  name="title"
                  value={formData.title}
                  maxLength={200}
                  placeholder={t("enter_requisition_title")}
                  onChange={(e) => {
                    const result = validateTitleOnType(e.target.value);

                    if (!result.valid) {
                      setErrors(prev => ({
                        ...prev,
                        title: result.message
                      }));
                      return;
                    }

                    handleInputChange({
                      target: {
                        name: "title",
                        value: result.value
                      }
                    });

                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.title;
                      return copy;
                    });
                  }}
                  onBlur={(e) =>
                    handleInputChange({
                      target: {
                        name: "title",
                        value: normalizeTitle(e.target.value).trim()
                      }
                    })
                  }

                />

                <Form.Text className="text-muted">
                  {t("title_help")}
                </Form.Text>
               <ErrorMessage>{renderError(errors.title)}</ErrorMessage>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {t("description")} <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={6}
                      maxLength={2000}
                      name="description"
                      placeholder={t("enter_description")}
                      value={formData.description}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      onBlur={(e) =>
                        handleInputChange({
                          target: {
                            name: "description",
                            value: e.target.value.trim()
                          }
                        })
                      }

                    />

                   <ErrorMessage>{renderError(errors.description)}</ErrorMessage>

                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("start_date")} <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          min={getTomorrowISO()} // ✅ tomorrow onwards
                          onChange={(e) => {
                            const startDate = e.target.value;


                            handleInputChange({
                              target: {
                                name: "startDate",
                                value: startDate
                              }
                            });


                            handleInputChange({
                              target: {
                                name: "endDate",
                                value: addCalendarDays(startDate, 21)
                              }
                            });


                            setErrors(prev => ({
                              ...prev,
                              startDate: "",
                              endDate: ""
                            }));
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t("start_date_help")}
                        </Form.Text>
                        <ErrorMessage>{renderError(errors.startDate)}</ErrorMessage>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          {t("end_date")} <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors((prev) => ({ ...prev, endDate: "" }));
                          }}
                          min={formData.startDate}

                        />
                        <Form.Text className="text-muted">
                          {t("end_date_help")}

                        </Form.Text>
                        <ErrorMessage>{renderError(errors.endDate)}</ErrorMessage>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {apiError && (
                <div className="mt-3">
                  <ErrorMessage>{apiError}</ErrorMessage>
                </div>
              )}
            </fieldset>
          </Form>
        </Card.Body>
      </Card>

      <div className="footer-actions">
        <Button variant="outline-secondary" onClick={() => navigate("/job-posting")}>
         {t("common:cancel")}
        </Button>

        {!isViewMode && (
          <Button onClick={handleSave} disabled={loading}>
            {editId ? t("common:update") : t("common:save")}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CreateRequisition;
