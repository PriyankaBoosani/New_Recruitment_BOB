import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../../../style/css/AddPosition.css";

const AddPosition = () => {
    const navigate = useNavigate();
    const { requisitionId } = useParams();

    /* ---------------- MAIN FORM ---------------- */
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
        enableStateDistribution: false
    });
    const GENERAL_FIELDS = [
        { key: "sc", label: "SC" },
        { key: "st", label: "ST" },
        { key: "obc", label: "OBC" },
        { key: "ews", label: "EWS" },
        { key: "gen", label: "GEN" },
        { key: "total", label: "Total" }
    ];

    const DISABILITY_FIELDS = [
        { key: "oc", label: "OC" },
        { key: "vi", label: "VI" },
        { key: "hi", label: "HI" },
        { key: "id", label: "ID" }
    ];

    /* ---------------- STATE WISE ---------------- */
    // const [stateDistribution, setStateDistribution] = useState([]);
    // const [currentStateData, setCurrentStateData] = useState({
    //     state: "",
    //     vacancies: "",
    //     language: "",
    //     sc: "",
    //     st: "",
    //     obc: "",
    //     ews: "",
    //     gen: "",
    //     total: "",
    //     oc: "",
    //     vi: "",
    //     hi: "",
    //     id: ""
    // });


    // const handleEditState = (index) => {
    //     const selectedRow = stateDistribution[index];

    //     // Load row data back into form
    //     setCurrentStateData(selectedRow);

    //     // Remove row from table (so it updates instead of duplicating)
    //     setStateDistribution(prev =>
    //         prev.filter((_, i) => i !== index)
    //     );
    // };
    // const handleDeleteState = (index) => {
    //     setStateDistribution(prev =>
    //         prev.filter((_, i) => i !== index)
    //     );
    // };


    /* ---------------- HANDLERS ---------------- */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleDocumentChange = (doc) => {
        setFormData((prev) => ({
            ...prev,
            documents: prev.documents.includes(doc)
                ? prev.documents.filter((d) => d !== doc)
                : [...prev.documents, doc]
        }));
    };



    // useEffect(() => {
    //     const total =
    //         Number(currentStateData.sc || 0) +
    //         Number(currentStateData.st || 0) +
    //         Number(currentStateData.obc || 0) +
    //         Number(currentStateData.ews || 0) +
    //         Number(currentStateData.gen || 0);

    //     setCurrentStateData((prev) => ({ ...prev, total }));
    // }, [
    //     currentStateData.sc,
    //     currentStateData.st,
    //     currentStateData.obc,
    //     currentStateData.ews,
    //     currentStateData.gen
    // ]);
    const STATIC_STATE_TABLE = [
        {
            state: "ANDHRA",
            vacancies: 10,
            language: "Telugu",
            sc: 2,
            st: 1,
            ews: 1,
            gen: 4,
            obc: 2,
            total: 10,
            hi: 1,
            id: 0,
            vi: 1,
            oc: 0
        }
    ];




    const handleSubmit = (e) => {
        e.preventDefault();
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

    /* ---------------- UI ---------------- */
    return (
        <Container fluid className="add-position-page">
            <div className="req_top-bar">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="link" className="back-btn p-0" onClick={() => navigate(-1)}>
                        ← Back
                    </Button>
                    <div>
                        <span className="req-id">REQ-{requisitionId}</span>
                        <div className="req-code">BOB/HRM/REC/ADVT/2025/12</div>
                    </div>
                </div>
                <Button variant="outline-primary">⬆ Import Positions</Button>
            </div>

            <Card className="position-card">
                <Card.Body>
                    <div className="section-title">
                        <span className="indicator"></span>
                        <h6>Add New Position</h6>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">

                            {/* BASIC FIELDS */}
                            <Col md={4}>
                                <Form.Label>Position *</Form.Label>
                                <Form.Select name="position" value={formData.position} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option>Developer</option>
                                    <option>Manager</option>
                                    <option>Analyst</option>
                                </Form.Select>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Department *</Form.Label>
                                <Form.Select name="department" value={formData.department} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option>IT</option>
                                    <option>HR</option>
                                    <option>Finance</option>
                                </Form.Select>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Total Vacancies *</Form.Label>
                                <Form.Control name="vacancies" placeholder="Enter Vacancies" type="number" value={formData.vacancies} onChange={handleInputChange} />
                            </Col>

                            <Col md={4}>
                                <Form.Label>Min Age *</Form.Label>
                                <Form.Control name="minAge" placeholder="Min Age" type="number" value={formData.minAge} onChange={handleInputChange} />
                            </Col>

                            <Col md={4}>
                                <Form.Label>Max Age *</Form.Label>
                                <Form.Control name="maxAge" placeholder="Max Age" type="number" value={formData.maxAge} onChange={handleInputChange} />
                            </Col>

                            <Col md={4}>
                                <Form.Label>Type of Employment</Form.Label>
                                <Form.Select name="employmentType" value={formData.employmentType} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option>Permanent</option>
                                    <option>Contract</option>
                                    <option>Temporary</option>
                                </Form.Select>
                            </Col>

                            <Col md={4}>
                                <Form.Label>CIBIL Score *</Form.Label>
                                <Form.Control name="cibilScore" placeholder="Enter CIBIL Score" type="number" value={formData.cibilScore} onChange={handleInputChange} />
                            </Col>


                            <Col md={4}>
                                <Form.Label>Grade / Scale</Form.Label>
                                <Form.Select name="grade" value={formData.grade} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                </Form.Select>
                            </Col>

                            <Col md={4} className="">

                                <Form.Label>Enable Location Preference</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="enable-location"
                                    checked={formData.enableLocation}
                                    onChange={handleInputChange}
                                    name="enableLocation"
                                    className="mb-3"
                                />
                            </Col>

                            {/* Education and Experience */}
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Mandatory Education *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="mandatoryEducation"
                                        value={formData.mandatoryEducation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Mandatory Education"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Mandatory Experience *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="mandatoryExperience"
                                        value={formData.mandatoryExperience}
                                        onChange={handleInputChange}
                                        placeholder="Enter Minimum experience"

                                    />
                                </Form.Group>

                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Preferred Education *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="preferredEducation"
                                        value={formData.preferredEducation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Preferred Education"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Preferred Experience *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="preferredExperience"
                                        value={formData.preferredExperience}
                                        onChange={handleInputChange}
                                        placeholder="Enter Preferred experience"

                                    />
                                </Form.Group>
                            </Col>

                            {/* DOCUMENTS */}
                            <Col md={6}>
                                <Form.Label>Documents Required *</Form.Label>
                                <div className="document-grid">
                                    {documents.map((doc) => (
                                        <Form.Check
                                            key={doc}
                                            label={doc}
                                            checked={formData.documents.includes(doc)}
                                            onChange={() => handleDocumentChange(doc)}
                                        />
                                    ))}
                                </div>
                            </Col>

                            {/* ROLES */}
                            <Col md={6}>
                                <Form.Label>Roles & Responsibilities *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                />
                            </Col>

                            {/* LOCATION WISE DISTRIBUTION */}
                            <Col xs={12}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h6 className="mb-0">Location Wise Distribution</h6>
                                        <small className="text-muted">Enable to distribute vacancies across states</small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        name="enableStateDistribution"
                                        checked={formData.enableStateDistribution}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* OFF */}
                                {!formData.enableStateDistribution && (
                                    <Row className="g-4">
                                        {/* General Category */}
                                        <Col md={7}>
                                            <Card className="p-3">
                                                <h6 className="text-primary mb-3">General Category</h6>
                                                <Row className="g-3">
                                                    {GENERAL_FIELDS.map(({ key, label }) => (
                                                        <Col md={2} key={key}>
                                                            <Form.Label className="small fw-semibold">{label}</Form.Label>
                                                            <Form.Control type="number" disabled />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card>
                                        </Col>

                                        {/* Disability Category */}
                                        <Col md={5}>
                                            <Card className="p-3">
                                                <h6 className="text-primary mb-3">Disability Category</h6>
                                                <Row className="g-3">
                                                    {DISABILITY_FIELDS.map(({ key, label }) => (
                                                        <Col md={3} key={key}>
                                                            <Form.Label className="small fw-semibold">{label}</Form.Label>
                                                            <Form.Control type="number" disabled />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                )}

                                {/* ON */}
                                {formData.enableStateDistribution && (
                                    <>
                                        <Row className="g-3 mb-3">
                                            <Col md={4}>
                                                <Form.Label>State *</Form.Label>
                                                <Form.Select defaultValue="">
                                                    <option value="">Select State</option>
                                                    <option value="ANDHRA">ANDHRA</option>
                                                    <option value="GUJARAT">GUJARAT</option>
                                                    <option value="JAMMU & KASHMIR">JAMMU & KASHMIR</option>
                                                </Form.Select>

                                            </Col>

                                            <Col md={4}>
                                                <Form.Label>Vacancies *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter Vacancies"
                                                />

                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>Local Language</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter local language"
                                                    />

                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="g-4 mt-3">
                                            {/* General Category */}
                                            <Col md={7}>
                                                <Card className="p-3">
                                                    <h6 className="text-primary mb-3">General Category</h6>
                                                    <Row className="g-3">
                                                        {GENERAL_FIELDS.map(({ key, label }) => (
                                                            <Col md={2} key={key}>
                                                                <Form.Label className="small fw-semibold">{label}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    disabled={key === "total"}
                                                                />

                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Card>
                                            </Col>

                                            {/* Disability Category */}
                                            <Col md={5}>
                                                <Card className="p-3">
                                                    <h6 className="text-primary mb-3">Disability Category</h6>
                                                    <Row className="g-3">
                                                        {DISABILITY_FIELDS.map(({ key, label }) => (
                                                            <Col md={3} key={key}>
                                                                <Form.Label className="small fw-semibold">{label}</Form.Label>
                                                                <Form.Control type="number" />

                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>


                                        <Button className="mt-3">
                                            Submit
                                        </Button>

                                        <table className="table table-bordered mt-4">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2">S No.</th>
                                                    <th rowSpan="2">State Name</th>
                                                    <th rowSpan="2">Vacancies</th>
                                                    <th rowSpan="2">Local Language of State</th>

                                                    <th rowSpan="2">SC</th>
                                                    <th rowSpan="2">ST</th>
                                                    <th rowSpan="2">EWS</th>
                                                    <th rowSpan="2">GEN</th>
                                                    <th rowSpan="2">OBC</th>
                                                    <th rowSpan="2">TOTAL</th>

                                                    <th colSpan="5" className="text-center">Out of Which</th>
                                                    <th rowSpan="2">Actions</th>
                                                </tr>

                                                <tr>
                                                    <th>HI</th>
                                                    <th>ID</th>
                                                    <th>VI</th>
                                                    <th>OC</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {STATIC_STATE_TABLE.map((row, index) => {
                                                    const disabilityTotal =
                                                        row.hi + row.id + row.vi + row.oc;

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{row.state}</td>
                                                            <td>{row.vacancies}</td>
                                                            <td>{row.language}</td>

                                                            <td>{row.sc}</td>
                                                            <td>{row.st}</td>
                                                            <td>{row.ews}</td>
                                                            <td>{row.gen}</td>
                                                            <td>{row.obc}</td>
                                                            <td>{row.total}</td>

                                                            <td>{row.hi}</td>
                                                            <td>{row.id}</td>
                                                            <td>{row.vi}</td>
                                                            <td>{row.oc}</td>
                                                            <td>{disabilityTotal}</td>

                                                            <td className="text-center">—</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>


                                        </table>
                                    </>
                                )}
                            </Col>
                        </Row>

                        <div className="form-footer mt-4">
                            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="ms-2 save-btn">
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
