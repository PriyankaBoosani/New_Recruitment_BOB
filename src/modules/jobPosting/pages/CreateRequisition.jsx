// src/modules/jobPostings/pages/CreateRequisition.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";
// import Stepper from "../component/Stepper";
import "../../../style/css/CreateRequisition.css";
import saveDraftIcon from "../../../assets/saveDraftIcon.png";


const CreateRequisition = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        // If start date changes, update end date to be 21 days later
        if (name === 'startDate' && value) {
            const startDate = new Date(value);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 21);
            newFormData.endDate = formatDate(endDate);
        }

        setFormData(newFormData);
    };

    const handleSaveDraft = () => {
        console.log("Save draft", formData);
    };

    const handleNext = () => {
        // In a real app, you would save the requisition first, then navigate
        // For now, we'll just navigate to the upload indent page
        // The ID '123' is a placeholder - in a real app, you'd use the actual requisition ID
        navigate("/job-posting/upload-indent");
    };

    return (
        <Container fluid className="create-requisition-page">
            {/* Stepper */}
            {/* <Stepper currentStep="REQUISITION" /> */}

            {/* Card */}
            <Card className="requisition-card">
                <Card.Body>
                    <div className="section-title">
                        <span className="indicator" />
                        <h6>Requisition Details</h6>
                    </div>

                    <Form>
                        {/* Title */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Requisition Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="BOB/HRM/REC/ADVT/2025/12"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <Form.Text muted>
                                Use a clear, searchable title used across the portal and job boards.
                            </Form.Text>
                        </Form.Group>

                        {/* Description */}
                        <Form.Group className="mb-4">
                            <Form.Label>
                                Description <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                placeholder="Enter overall description / objective for this hiring drive..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {/* Dates */}
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Start Date <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div className="date-input">
                                        <Form.Control
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <Calendar />
                                    </div>
                                    <Form.Text muted>
                                        Date from which candidates can start applying.
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        End Date <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div className="date-input">
                                        <Form.Control
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            min={formData.startDate} // Ensures end date is not before start date
                                            className="date-input-field"
                                        />
                                        <Calendar />
                                    </div>
                                    <Form.Text muted>
                                        ⓘ Standard duration: 21 days.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Footer Actions */}
            <div className="footer-actions">
                 <Button className="backbtn"
                          variant="outline-secondary"
                          onClick={() => navigate(`/job-posting`)}
                        >
                          ← Back
                        </Button>

                <div>
                    <Button
                        variant="outline-primary"
                        className="me-2 savebtn"
                        onClick={handleSaveDraft}
                    >
                       <img src={saveDraftIcon} alt="saveDraftIcon" className='icon-16' /> Save Draft
                    </Button>
                    <Button className="primary-btn createbtnsave" onClick={handleNext}>
                        Create Requisition & Next →
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default CreateRequisition;
