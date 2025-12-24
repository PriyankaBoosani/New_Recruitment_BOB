// src/modules/jobPostings/pages/CreateRequisition.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";
import "../../../style/css/CreateRequisition.css";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { validateRequisitionForm } from '../validations/requisition-validation';

const CreateRequisition = () => {
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        if (name === "startDate" && value) {
            const d = new Date(value);
            d.setDate(d.getDate() + 21);
            updated.endDate = formatDate(d);

        }

        setFormData(updated);
    };
    const [indentFile, setIndentFile] = useState(null);
    const fileInputRef = useRef(null);
    const handleSave = (e) => {
        e?.preventDefault();

        const { valid, errors } = validateRequisitionForm(formData, indentFile);
        setErrors(errors);

        if (valid) {
            console.log('Form is valid, submitting...', {
                ...formData,
                file: indentFile
            });
            // TODO: Add your form submission logic here
        } else {
            // Scroll to the first error
            const firstError = Object.keys(errors)[0];
            if (firstError) {
                const element = document.querySelector(`[name="${firstError}"]`) ||
                    document.querySelector('.upload-box');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    };



    return (
        <Container fluid className="create-requisition-page">
            <Card className="requisition-card">
                <Card.Body>

                    {/* Title */}
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
                                placeholder="BOB/HRM/REC/ADVT/2025/12"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.title}
                            </Form.Control.Feedback>
                            <Form.Text muted>
                                Use a clear, searchable title used across the portal and job boards.
                            </Form.Text>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Description <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="description"
                                        placeholder="Enter overall description / objective for this hiring drive..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        isInvalid={!!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Upload Indent <span className="text-danger">*</span></Form.Label>
                                    <div
                                        className={`upload-box ${errors.indentFile ? 'is-invalid' : ''}`}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <div className="upload-icon">⬆</div>
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
                                    {errors.indentFile && (
                                        <div className="invalid-feedback d-block">
                                            {errors.indentFile}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setIndentFile(file);
                                            // Clear file error when new file is selected
                                            if (errors.indentFile) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.indentFile;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Start Date <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div className="date-input">
                                        <Form.Control
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            isInvalid={!!errors.startDate}
                                            min={new Date().toISOString().split('T')[0]}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startDate}
                                        </Form.Control.Feedback>
                                    </div>
                                    <Form.Text muted>
                                        Date from which candidates can start applying.
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        End Date <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div className="date-input">
                                        <Form.Control
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            min={formData.startDate}
                                            isInvalid={!!errors.endDate}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endDate}
                                        </Form.Control.Feedback>
                                    </div>
                                    <Form.Text muted>
                                        ⓘ Standard duration: 21 days.
                                    </Form.Text>                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Footer */}
            <div className="footer-actions">
                <Button variant="outline-secondary" onClick={() => navigate("/job-posting")}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="primary-btn"
                    onClick={handleSave}
                >
                    Save
                </Button>


            </div>
        </Container>
    );
};

export default CreateRequisition;
