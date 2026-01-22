import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import "../../../style/css/CreateRequisition.css";

import ErrorMessage from "../../../shared/components/ErrorMessage";
import { validateRequisitionForm, validateTitleOnType, normalizeTitle } from "../validations/requisition-validation";
import { mapRequisitionToApi } from "../mappers/createRequisitionMapper";
import { useCreateRequisition } from "../hooks/useCreateRequisition";
import { REQUISITION_CONFIG } from "../config/requisitionConfig";


const CreateRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ===================== URL + MODE ===================== */
  const query = new URLSearchParams(location.search);
  const editId = query.get("id"); //  DEFINE FIRST
  const mode = location.state?.mode; // "view" | "edit" | undefined

  const isCreateMode = !editId;
  const isViewMode = !!editId && mode === "view";
  const isEditMode = !!editId && mode !== "view";

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
      navigate(REQUISITION_CONFIG.SUCCESS_REDIRECT);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ===================== LOADER ===================== */
  if (fetching) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading Requisition...</p>
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
                ? "View Requisition"
                : editId
                  ? "Edit Requisition"
                  : "Create New Requisition"}
            </h6>
          </div>

          <Form onSubmit={handleSave}>
            {/*  THIS WAS MISSING */}
            <fieldset disabled={isViewMode}>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>
                  Requisition Title <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  name="title"
                  value={formData.title}
                  placeholder="Enter Requisition Title"
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
                  Use a clear, searchable title used across the portal and job boards.
                </Form.Text>
                <ErrorMessage>{errors.title}</ErrorMessage>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Description <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="description"
                      placeholder="Enter Requisition Description"
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

                    <ErrorMessage>{errors.description}</ErrorMessage>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Start Date <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors((prev) => ({
                              ...prev,
                              startDate: "",
                              endDate: ""
                            }));
                          }}
                          min={new Date().toISOString().split("T")[0]}
                         
                        />
                        <Form.Text className="text-muted">
                          Date from which the candidates can start applying.
                        </Form.Text>
                        <ErrorMessage>{errors.startDate}</ErrorMessage>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          End Date <span className="text-danger">*</span>
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
                          ⓘ Standard duration: 21 days.
                        </Form.Text>
                        <ErrorMessage>{errors.endDate}</ErrorMessage>
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
          Cancel
        </Button>

        {!isViewMode && (
          <Button onClick={handleSave} disabled={loading}>
            {editId ? "Update" : "Save"}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CreateRequisition;
