import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../../../style/css/CreateRequisition.css";

import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_Icon from "../../../assets/upload_Icon.png";

import { validateRequisitionForm } from "../validations/requisition-validation";
import { mapRequisitionToApi } from "../mappers/requisitionMapper";
import { useCreateRequisition } from "../hooks/useCreateRequisition";
import { REQUISITION_CONFIG } from "../config/requisitionConfig";

const CreateRequisition = () => {
  const navigate = useNavigate();

  const { createRequisition, loading, error: apiError } =
    useCreateRequisition();

  const [errors, setErrors] = useState({});
  const [indentFile, setIndentFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "startDate" && value) {
        const d = new Date(value);
        d.setDate(
          d.getDate() + REQUISITION_CONFIG.DEFAULT_DURATION_DAYS
        );
        updated.endDate = formatDate(d);
      }

      return updated;
    });

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      if (name === "startDate") delete copy.endDate;
      return copy;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { valid, errors } =
      validateRequisitionForm(formData, indentFile);

    setErrors(errors);
    if (!valid) return;

    const payload = mapRequisitionToApi(formData, indentFile);

    try {
      await createRequisition(payload);
      navigate(REQUISITION_CONFIG.SUCCESS_REDIRECT);
    } catch {
      // error handled in hook
    }
  };

  return (
    <Container fluid className="create-requisition-page">
      <Card className="requisition-card">
        <Card.Body>
          <div className="section-title">
            <span className="indicator" />
            <h6>Create New Requisition</h6>
          </div>

          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>
                Requisition Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Enter requisition title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <ErrorMessage>{errors.title}</ErrorMessage>
              <Form.Text muted>
                Use a clear, searchable title used across the portal and job boards.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <ErrorMessage>{errors.description}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Upload Indent <span className="text-danger">*</span>
                  </Form.Label>

                  <div
                    className={`upload-box ${errors.indentFile ? "is-invalid" : ""
                      }`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="upload-icon">
                      <img src={upload_Icon} alt="upload_Icon" className="icon-40" />
                    </div>
                    <p>
                      Drag & drop your file here, or
                      <span className="upload-link"> Click to Upload</span>
                    </p>
                    <small>Supported formats: PDF, DOC, PNG, JPG (Max 5 MB)</small>
                    {indentFile && (
                      <div className="selected-file">
                        📄 {indentFile.name}
                      </div>
                    )}
                  </div>

                  <ErrorMessage>{errors.indentFile}</ErrorMessage>

                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={(e) =>
                      setIndentFile(e.target.files[0])
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={formatDate(new Date())}
                  />
                  <ErrorMessage>{errors.startDate}</ErrorMessage>
                  <Form.Text muted>
                    Date from which candidates can start applying.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                  />
                  <ErrorMessage>{errors.endDate}</ErrorMessage>
                  <Form.Text muted>
                    ⓘ Standard duration: 21 days.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
          </Form>
        </Card.Body>
      </Card>

      <div className="footer-actions">
        <Button
          variant="outline-secondary"

          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>

        <Button
          className="primary-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Container>
  );
};

export default CreateRequisition;
