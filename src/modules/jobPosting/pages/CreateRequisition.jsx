import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import "../../../style/css/CreateRequisition.css";

import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_Icon from "../../../assets/upload_Icon.png";

import { validateRequisitionForm } from "../validations/requisition-validation";
import { mapRequisitionToApi } from "../mappers/requisitionMapper";
import { useCreateRequisition } from "../hooks/useCreateRequisition";
import { REQUISITION_CONFIG } from "../config/requisitionConfig";
import { FILE_BASE_URL } from "../config/fileConfig";

const CreateRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const query = new URLSearchParams(location.search);
  const editId = query.get("id");

  const {
    formData,
    handleInputChange,
    indentFile,
    setIndentFile,
    existingIndentPath,
    saveRequisition,
    loading,
    fetching,
    error: apiError,
  } = useCreateRequisition(editId);

  const [errors, setErrors] = useState({});

  const buildFileUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${FILE_BASE_URL}${path.replace("/var/www/html", "")}`;
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();

    const { valid, errors: valErrors } = validateRequisitionForm(
      formData,
      indentFile,
      Boolean(editId),
      existingIndentPath
    );

    if (!valid) return setErrors(valErrors);

    try {
      const payload = mapRequisitionToApi(formData, indentFile, editId);
      await saveRequisition(payload);
      navigate(REQUISITION_CONFIG.SUCCESS_REDIRECT);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  if (fetching) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading Requisition...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="create-requisition-page">
      <Card className="requisition-card">
        <Card.Body>
          <div className="section-title">
            <span className="indicator" />
            <h6>{editId ? "Edit Requisition" : "Create New Requisition"}</h6>
          </div>

          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Requisition Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={(e) => { handleInputChange(e); setErrors({ ...errors, title: "" }); }}
                isInvalid={!!errors.title}
              />
              <ErrorMessage>{errors.title}</ErrorMessage>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={(e) => { handleInputChange(e); setErrors({ ...errors, description: "" }); }}
                    isInvalid={!!errors.description}
                  />
                  <ErrorMessage>{errors.description}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Upload Indent {!editId && <span className="text-danger">*</span>}</Form.Label>
                  <div className={`upload-box ${errors.indentFile ? "is-invalid" : ""}`} onClick={() => fileInputRef.current.click()}>
                    <img src={upload_Icon} alt="upload" className="icon-40" />
                    <p>Drag & drop or <span className="upload-link"> Click to Upload</span></p>
                    
                    {indentFile ? (
                      <div className="selected-file mt-2">📄 {indentFile.name}</div>
                    ) : existingIndentPath && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <span className="text-muted">📄 Current File</span>
                        <Button size="sm" variant="link" onClick={(e) => { e.stopPropagation(); window.open(buildFileUrl(existingIndentPath), "_blank"); }}>View</Button>
                      </div>
                    )}
                  </div>
                  <ErrorMessage>{errors.indentFile}</ErrorMessage>
                  <input type="file" hidden ref={fileInputRef} onChange={(e) => setIndentFile(e.target.files[0])} />
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
                    onChange={handleInputChange} 
                    min={new Date().toISOString().split("T")[0]} 
                  />
                  <ErrorMessage>{errors.startDate}</ErrorMessage>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleInputChange} 
                    min={formData.startDate} 
                  />
                  <ErrorMessage>{errors.endDate}</ErrorMessage>
                </Form.Group>
              </Col>
            </Row>
            {apiError && <div className="mt-3"><ErrorMessage>{apiError}</ErrorMessage></div>}
          </Form>
        </Card.Body>
      </Card>

      <div className="footer-actions">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="primary-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Processing..." : editId ? "Update" : "Save"}
        </Button>
      </div>
    </Container>
  );
};

export default CreateRequisition;