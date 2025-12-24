import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../../../style/css/AddPosition.css";
// Using text instead of react-icons/ai

const AddPosition = () => {
    const navigate = useNavigate();
    const { requisitionId } = useParams();
    const [formData, setFormData] = useState({
        department: "",
        position: "",
        vacancies: "",
        minAge: "",
        maxAge: "",
        employmentType: "",
        cibilScore: "",
        grade: "",
        enableLocation: false,
        mandatoryEducation: "",
        preferredEducation: "",
        mandatoryExperience: "",
        preferredExperience: "",
        documents: [],
        responsibilities: "",
        enableStateDistribution: false,
        // General Category
        sc: "",
        st: "",
        obc: "",
        ews: "",
        gen: "",
        total: "",
        // Disability Category
        oc: "",
        vi: "",
        hi: "",
        id: ""
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDocumentChange = (doc) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.includes(doc)
                ? prev.documents.filter(d => d !== doc)
                : [...prev.documents, doc]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    const documents = [
        "Aadhaar Card",
        "PAN Card",
        "10th Marksheet",
        "12th Marksheet",
        "Graduation Certificate",
        "PG Certificate",
        "Caste Certificate",
        "Income Certificate",
        "Birth Certificate"
    ];

    return (
        <Container fluid className="add-position-page">
            <div className="top-bar">
                <Button variant="link" className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <div>
                    <span className="req-id">REQ-{requisitionId}</span>
                    <div className="req-code">BOB/HRM/REC/ADVT/2025/12</div>
                </div>
                <Button variant="outline-primary" className="import-btn">
                    ⬆ Import Positions
                </Button>
            </div>

            <Card className="position-card">
                <Card.Body>
                    <h6 className="section-title">Add New Position</h6>
                    <hr />

                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            {/* Basic Information */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                                    <Form.Select 
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="IT">IT</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                                    <Form.Select 
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Analyst">Analyst</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Total Vacancies <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="vacancies"
                                        value={formData.vacancies}
                                        onChange={handleInputChange}
                                        placeholder="Enter Vacancies"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Min Age <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="minAge"
                                        value={formData.minAge}
                                        onChange={handleInputChange}
                                        placeholder="Min Age"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Max Age <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="maxAge"
                                        value={formData.maxAge}
                                        onChange={handleInputChange}
                                        placeholder="Max Age"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Type of Employment</Form.Label>
                                    <Form.Select 
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Permanent">Permanent</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Temporary">Temporary</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>CIBIL Score <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="cibilScore"
                                        value={formData.cibilScore}
                                        onChange={handleInputChange}
                                        placeholder="Enter Cibil Score"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Grade / Scale</Form.Label>
                                    <Form.Select 
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="A">Grade A</option>
                                        <option value="B">Grade B</option>
                                        <option value="C">Grade C</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4} className="d-flex align-items-center">
                                <Form.Check
                                    type="switch"
                                    id="enable-location"
                                    label="Enable Location Preferences"
                                    checked={formData.enableLocation}
                                    onChange={handleInputChange}
                                    name="enableLocation"
                                />
                            </Col>

                            {/* Education and Experience */}
                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Mandatory Education <span className="text-danger">*</span></Form.Label>
                                        <Button variant="link" size="sm" className="p-0">
💡 AI Suggestions
                                        </Button>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="mandatoryEducation"
                                        value={formData.mandatoryEducation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Mandatory Education..."
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Preferred Education <span className="text-danger">*</span></Form.Label>
                                        <Button variant="link" size="sm" className="p-0">
💡 AI Suggestions
                                        </Button>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="preferredEducation"
                                        value={formData.preferredEducation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Preferred Education..."
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Mandatory Experience <span className="text-danger">*</span></Form.Label>
                                        <Button variant="link" size="sm" className="p-0">
💡 AI Suggestions
                                        </Button>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="mandatoryExperience"
                                        value={formData.mandatoryExperience}
                                        onChange={handleInputChange}
                                        placeholder="Enter Mandatory Experience..."
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Preferred Experience <span className="text-danger">*</span></Form.Label>
                                        <Button variant="link" size="sm" className="p-0">
💡 AI Suggestions
                                        </Button>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="preferredExperience"
                                        value={formData.preferredExperience}
                                        onChange={handleInputChange}
                                        placeholder="Enter Preferred Experience..."
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* Documents Required */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Documents Required <span className="text-danger">*</span></Form.Label>
                                    <div className="document-grid">
                                        {documents.map((doc) => (
                                            <Form.Check
                                                key={doc}
                                                type="checkbox"
                                                id={`doc-${doc}`}
                                                label={doc}
                                                checked={formData.documents.includes(doc)}
                                                onChange={() => handleDocumentChange(doc)}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>

                            {/* Roles & Responsibilities */}
                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Roles & Responsibilities <span className="text-danger">*</span></Form.Label>
                                        <Button variant="link" size="sm" className="p-0">
💡 AI Suggestions
                                        </Button>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="responsibilities"
                                        value={formData.responsibilities}
                                        onChange={handleInputChange}
                                        placeholder="Enter key responsibilities..."
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* Location Wise Distribution */}
                            <Col xs={12}>
                                <div className="location-distribution">
                                    <Form.Check
                                        type="switch"
                                        id="enable-state-distribution"
                                        label="Enable to distribute vacancies across states"
                                        checked={formData.enableStateDistribution}
                                        onChange={handleInputChange}
                                        name="enableStateDistribution"
                                        className="mb-3"
                                    />

                                    <div className={formData.enableStateDistribution ? '' : 'opacity-50'}>
                                        <Row className="mt-3">
                                            <Col md={6} className="gencat">
                                                <h6>General Category</h6>
                                                <Row className="g-3">
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>SC</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="sc"
                                                                value={formData.sc}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>ST</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="st"
                                                                value={formData.st}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>OBC</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="obc"
                                                                value={formData.obc}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>EWS</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="ews"
                                                                value={formData.ews}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>GEN</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="gen"
                                                                value={formData.gen}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4} md={2}>
                                                        <Form.Group>
                                                            <Form.Label>Total</Form.Label>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="total"
                                                                value={formData.total}
                                                                onChange={handleInputChange}
                                                                readOnly
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col md={4} className="discat">
                                                <h6>Disability Category</h6>
                                                <Row className="g-2">
                                                    <Col xs={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small">OC</Form.Label>
                                                            <Form.Control 
                                                                size="sm"
                                                                type="number" 
                                                                name="oc"
                                                                value={formData.oc}
                                                                onChange={handleInputChange}
                                                                className="p-1"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small">VI</Form.Label>
                                                            <Form.Control 
                                                                size="sm"
                                                                type="number" 
                                                                name="vi"
                                                                value={formData.vi}
                                                                onChange={handleInputChange}
                                                                className="p-1"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small">HI</Form.Label>
                                                            <Form.Control 
                                                                size="sm"
                                                                type="number" 
                                                                name="hi"
                                                                value={formData.hi}
                                                                onChange={handleInputChange}
                                                                className="p-1"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small">ID</Form.Label>
                                                            <Form.Control 
                                                                size="sm"
                                                                type="number" 
                                                                name="id"
                                                                value={formData.id}
                                                                onChange={handleInputChange}
                                                                className="p-1"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="form-footer">
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => navigate(-1)}
                                className="me-2"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="save-btn"
                            >
                                Save
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddPosition;