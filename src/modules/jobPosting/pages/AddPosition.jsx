import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../../../style/css/AddPosition.css";
import import_Icon from '../../../assets/import_Icon.png'
import ImportModal from "../component/ImportModal";
import EducationModal from "../component/EducationModal";
import { validateAddPosition } from "../validations/validateAddPosition";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_icon from '../../../assets/upload_Icon.png'
import { useCreateJobPosition } from "../hooks/useCreateJobPosition";
import { useMasterData } from "../hooks/useMasterData";

const AddPosition = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { requisitionId } = useParams();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);

    const { departments, positions, jobGrades, employmentTypes, reservationCategories, disabilityCategories, users,
        educationTypes,
        qualifications,
        specializations,
    } = useMasterData();


    const [eduMode, setEduMode] = useState("mandatory"); // mandatory | preferred

    const [educationData, setEducationData] = useState({
        mandatory: {
            educations: [],
            certificationIds: [],
            text: ""
        },

        preferred: {
            educations: [],
            certificationIds: [],
            text: ""
        }
    });

    


    const [indentFile, setIndentFile] = useState(null);
    const [approvedBy, setApprovedBy] = useState("");
    const [approvedOn, setApprovedOn] = useState("");

    const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
    const MAX_FILE_SIZE_MB = 2;
    const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => i); // 0–30 years
    const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12 months
    const { createPosition, loading } = useCreateJobPosition();




    const handleImport = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Replace with your actual API call
            // await api.post('/positions/import', formData);

            // Show success message
            // toast.success("Positions imported successfully");
        } catch (error) {
            throw new Error("Failed to import positions");
        }
    };
    /* ---------------- MAIN FORM ---------------- */
    const [formData, setFormData] = useState({
        department: "",
        position: "",
        vacancies: "",
        minAge: "",
        maxAge: "",
        employmentType: "",
        contractualPeriod: "",
        grade: "",
        enableLocation: false,
        mandatoryEducation: "",
        preferredEducation: "",
        mandatoryExperience: {
            years: "",
            months: "",
            description: ""
        },
        preferredExperience: {
            years: "",
            months: "",
            description: ""
        },
        documents: [],
        responsibilities: "",
        medicalRequired: "",
        enableStateDistribution: false
    });



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

        // ✅ clear error for this field
        setErrors((prev) => {
            if (!prev[name]) return prev;
            const updated = { ...prev };
            delete updated[name];
            return updated;
        });
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




    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateAddPosition({
            formData,
            educationData,
            indentFile,
            approvedBy,
            approvedOn
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const success = await createPosition({
            formData,
            educationData,
            requisitionId,
            indentFile,
            approvedBy,
            approvedOn
        });

        if (success) {
            navigate(-1);
        }
    };




    /* ---------------- UI ---------------- */
    return (
        <Container fluid className="add-position-page">
            <div className="req_top-bar">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="link" className="back-btn p-2" onClick={() => navigate(-1)}>
                        ← Back
                    </Button>
                    <div>
                        <span className="req-id">REQ-{requisitionId}</span>
                        <div className="req-code">BOB/HRM/REC/ADVT/2025/12</div>
                    </div>
                </div>
                <Button className="imprcls"
                    variant="none"
                    onClick={() => setShowImportModal(true)}
                >
                    <img src={import_Icon} alt="import_Icon" className="icon-14" /> Import Positions
                </Button>
            </div>

            <Card className="position-card">
                <Card.Body>
                    <div className="section-title">
                        <span className="indicator"></span>
                        <h6>Add New Position</h6>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4 mb-4 upload-indent-section">
                            {/* LEFT: Upload Indent */}
                            <Col md={8} className="mt-3">
                                <Form.Group>
                                    <Form.Label>
                                        Upload Indent <span className="text-danger">*</span>
                                    </Form.Label>

                                    <div
                                        className={`upload-indent-box ${errors.indentFile ? "is-invalid" : ""}`}
                                        onClick={() => document.getElementById("indentFileInput").click()}
                                    >
                                        {indentFile ? (
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="file-icon">📄</span>
                                                <div>
                                                    <div className="fw-semibold">{indentFile.name}</div>
                                                    <small className="text-muted">
                                                        {(indentFile.size / 1024).toFixed(2)} KB
                                                    </small>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted">
                                                <img src={upload_icon} alt="upload_icon" className="icon-40" />

                                                <div>
                                                    Drag & drop your file here, or{" "}<br />
                                                    <span className="text-primary">Click to Upload</span>
                                                </div>
                                                <small>
                                                    Supported formats: PDF, DOC, DOCX (Max 2 MB)
                                                </small>
                                            </div>

                                        )}
                                    </div>

                                    <input
                                        id="indentFileInput"
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const extension = "." + file.name.split(".").pop().toLowerCase();
                                            const fileSizeMB = file.size / (1024 * 1024);

                                            // ❌ Invalid type
                                            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    indentFile: "Only PDF, DOC, and DOCX files are allowed"
                                                }));
                                                e.target.value = "";
                                                return;
                                            }

                                            // ❌ Invalid size
                                            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    indentFile: "File size must not exceed 2 MB"
                                                }));
                                                e.target.value = "";
                                                return;
                                            }

                                            // ✅ Valid file
                                            setIndentFile(file);
                                            setErrors(prev => {
                                                const updated = { ...prev };
                                                delete updated.indentFile;
                                                return updated;
                                            });
                                        }}
                                    />


                                    <ErrorMessage>{errors.indentFile}</ErrorMessage>
                                </Form.Group>
                            </Col>

                            {/* RIGHT: Approved By / Approved On */}
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Approved By <span className="text-danger">*</span>
                                    </Form.Label>

                                    <Form.Select
                                        value={approvedBy}
                                        onChange={(e) => {
                                            setApprovedBy(e.target.value);
                                            setErrors(prev => ({ ...prev, approvedBy: "" }));
                                        }}
                                    >
                                        <option value="">Select</option>

                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}{user.role ? ` (${user.role})` : ""}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    <ErrorMessage>{errors.approvedBy}</ErrorMessage>
                                </Form.Group>


                                <Form.Group>
                                    <Form.Label>
                                        Approved On <span className="text-danger">*</span>
                                    </Form.Label>

                                    <Form.Control
                                        type="date"
                                        value={approvedOn}
                                        onChange={(e) => {
                                            setApprovedOn(e.target.value);
                                            setErrors(prev => ({ ...prev, approvedOn: "" }));
                                        }}
                                    />

                                    <ErrorMessage>{errors.approvedOn}</ErrorMessage>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-4">

                            {/* BASIC FIELDS */}
                            <Col md={4}>
                                <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="position"
                                    value={formData.position}
                                    onChange={(e) => {
                                        const positionId = e.target.value;
                                        const selected = positions.find(
                                            (p) => String(p.id) === String(positionId)
                                        );

                                        if (!selected) return;

                                        setFormData((prev) => ({
                                            ...prev,
                                            position: positionId,
                                            department: String(selected.deptId),
                                            minAge: selected.minAge ?? "",
                                            maxAge: selected.maxAge ?? "",
                                            grade: String(selected.gradeId ?? ""),
                                            responsibilities: selected.rolesResponsibilities ?? "",
                                            mandatoryEducation: selected.mandatoryEducation ?? "",
                                            preferredEducation: selected.preferredEducation ?? "",
                                            mandatoryExperience: {
                                                ...prev.mandatoryExperience,
                                                description: selected.mandatoryExperience ?? "",
                                            },
                                            preferredExperience: {
                                                ...prev.preferredExperience,
                                                description: selected.preferredExperience ?? "",
                                            },
                                        }));
                                    }}
                                >
                                    <option value="">Select</option>
                                    {positions.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </Form.Select>


                                <ErrorMessage>{errors.position}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.label}
                                        </option>
                                    ))}
                                </Form.Select>

                                <ErrorMessage>{errors.department}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Total Vacancies <span className="text-danger">*</span></Form.Label>
                                <Form.Control name="vacancies" placeholder="Enter Vacancies" type="number" value={formData.vacancies} onChange={handleInputChange} />
                                <ErrorMessage>{errors.vacancies}</ErrorMessage>
                            </Col>
                            {/* <Col xs={2} md={4}>
                                <Form.Group className="form-group">
                                    <Form.Label>
                                        Total Experience<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        name="totalExperience"
                                        value={formData.totalExperience}
                                        onChange={handleInputChange}

                                        placeholder="Enter Total Experience"
                                    />

                                </Form.Group>
                            </Col> */}

                            <Col md={4}>
                                <Form.Label>Min Age <span className="text-danger">*</span></Form.Label>
                                <Form.Control name="minAge" placeholder="Min Age" type="number" value={formData.minAge} onChange={handleInputChange} />
                                <ErrorMessage>{errors.minAge}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Max Age <span className="text-danger">*</span></Form.Label>
                                <Form.Control name="maxAge" placeholder="Max Age" type="number" value={formData.maxAge} onChange={handleInputChange} />
                                <ErrorMessage>{errors.maxAge}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Type of Employment</Form.Label>
                                <Form.Select
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    {employmentTypes.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.label}
                                        </option>
                                    ))}
                                </Form.Select>

                                <ErrorMessage>{errors.employmentType}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Contractual Period(Years)</Form.Label>
                                <Form.Control name="contractualPeriod" placeholder="Enter Contractual Period" type="number" value={formData.contractualPeriod} onChange={handleInputChange} />
                                <ErrorMessage>{errors.contractualPeriod}</ErrorMessage>
                            </Col>

                            <Col md={4}>
                                <Form.Label>Grade / Scale</Form.Label>
                                <Form.Select
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    {jobGrades.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.code} {g.scale ? `- ${g.scale}` : ""}
                                        </option>
                                    ))}
                                </Form.Select>

                                <ErrorMessage>{errors.grade}</ErrorMessage>
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
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Form.Label className="mb-0">
                                            Mandatory Education <span className="text-danger">*</span>
                                        </Form.Label>

                                        <Button
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => {
                                                setEduMode("mandatory");
                                                setShowEduModal(true);
                                            }}
                                        >
                                            + Add
                                        </Button>
                                    </div>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        readOnly
                                        value={educationData.mandatory.text || ""}
                                    />
                                </Form.Group>
                                <ErrorMessage>{errors.mandatoryEducation}</ErrorMessage>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Form.Label className="mb-0">
                                            Preferred Education <span className="text-danger">*</span>
                                        </Form.Label>

                                        <Button
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => {
                                                setEduMode("preferred");
                                                setShowEduModal(true);
                                            }}
                                        >
                                            + Add
                                        </Button>
                                    </div>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        readOnly
                                        value={educationData.preferred.text || ""}
                                    />
                                </Form.Group>
                                <ErrorMessage>{errors.preferredEducation}</ErrorMessage>
                            </Col>


                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Mandatory Experience <span className="text-danger">*</span>
                                    </Form.Label>

                                    <Row className="g-2 mb-2">
                                        {/* Years */}
                                        <Col md={6}>
                                            <Form.Select
                                                value={formData.mandatoryExperience.years}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        mandatoryExperience: {
                                                            ...prev.mandatoryExperience,
                                                            years: value
                                                        }
                                                    }));
                                                    setErrors(prev => {
                                                        const updated = { ...prev };
                                                        delete updated.mandatoryExperience;
                                                        return updated;
                                                    });
                                                }}
                                            >
                                                <option value="">Select Years</option>
                                                {YEAR_OPTIONS.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>

                                        {/* Months */}
                                        <Col md={6}>
                                            <Form.Select
                                                value={formData.mandatoryExperience.months}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        mandatoryExperience: {
                                                            ...prev.mandatoryExperience,
                                                            months: value
                                                        }
                                                    }));
                                                    setErrors(prev => {
                                                        const updated = { ...prev };
                                                        delete updated.mandatoryExperience;
                                                        return updated;
                                                    });
                                                }}
                                            >
                                                <option value="">Select Months</option>
                                                {MONTH_OPTIONS.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>

                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter mandatory experience details"
                                        value={formData.mandatoryExperience.description}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                mandatoryExperience: {
                                                    ...prev.mandatoryExperience,
                                                    description: e.target.value
                                                }
                                            }));
                                            setErrors(prev => {
                                                const updated = { ...prev };
                                                delete updated.mandatoryExperience;
                                                return updated;
                                            });
                                        }}
                                    />

                                    <ErrorMessage>{errors.mandatoryExperience}</ErrorMessage>
                                </Form.Group>
                            </Col>


                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Preferred Experience <span className="text-danger">*</span>
                                    </Form.Label>

                                    <Row className="g-2 mb-2">
                                        {/* Years */}
                                        <Col md={6}>
                                            <Form.Select
                                                value={formData.preferredExperience.years}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        preferredExperience: {
                                                            ...prev.preferredExperience,
                                                            years: value
                                                        }
                                                    }));
                                                    setErrors(prev => {
                                                        const updated = { ...prev };
                                                        delete updated.preferredExperience;
                                                        return updated;
                                                    });
                                                }}
                                            >
                                                <option value="">Select Years</option>
                                                {YEAR_OPTIONS.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>

                                        {/* Months */}
                                        <Col md={6}>
                                            <Form.Select
                                                value={formData.preferredExperience.months}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        preferredExperience: {
                                                            ...prev.preferredExperience,
                                                            months: value
                                                        }
                                                    }));
                                                    setErrors(prev => {
                                                        const updated = { ...prev };
                                                        delete updated.preferredExperience;
                                                        return updated;
                                                    });
                                                }}
                                            >
                                                <option value="">Select Months</option>
                                                {MONTH_OPTIONS.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>

                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter preferred experience details"
                                        value={formData.preferredExperience.description}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                preferredExperience: {
                                                    ...prev.preferredExperience,
                                                    description: e.target.value
                                                }
                                            }));
                                            setErrors(prev => {
                                                const updated = { ...prev };
                                                delete updated.preferredExperience;
                                                return updated;
                                            });
                                        }}
                                    />

                                    <ErrorMessage>{errors.preferredExperience}</ErrorMessage>
                                </Form.Group>
                            </Col>

                            {/* ROLES */}
                            <Col md={6}>
                                <Form.Label>Roles & Responsibilities <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                />
                                <ErrorMessage>{errors.responsibilities}</ErrorMessage>
                            </Col>
                            <Col md={2}>
                                <Form.Label>Medical Required<span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    as="select"
                                    name="medicalRequired"
                                    value={formData.medicalRequired}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select...</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Form.Select>
                                <ErrorMessage>{errors.medicalRequired}</ErrorMessage>
                            </Col>

                            {/* Category WISE Reservation */}
                            <Col xs={12}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h6 className="mb-0">Category Wise Reservation</h6>
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
                                                    {reservationCategories.map(cat => (
                                                        <Col md={2} key={cat.id}>
                                                            <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
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
                                                    {disabilityCategories.map(({ id, disabilityCode }) => (
                                                        <Col md={3} key={id}>
                                                            <Form.Label className="small fw-semibold">
                                                                {disabilityCode}
                                                            </Form.Label>
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
                                                <Form.Label>Vacancies <span className="text-danger">*</span></Form.Label>
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
                                                        {reservationCategories.map(cat => (
                                                            <Col md={2} key={cat.id}>
                                                                <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
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
                                                        {disabilityCategories.map(({ id, disabilityCode }) => (
                                                            <Col md={3} key={id}>
                                                                <Form.Label className="small fw-semibold">
                                                                    {disabilityCode}
                                                                </Form.Label>
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
            <ImportModal
                show={showImportModal}
                onHide={() => setShowImportModal(false)}
                onSuccess={() => {
                    // optionally refresh positions table
                }}
            />
            <EducationModal
                show={showEduModal}
                mode={eduMode}
                initialData={educationData[eduMode]}
                educationTypes={educationTypes}
                qualifications={qualifications}
                specializations={specializations}
                onHide={() => setShowEduModal(false)}
                onSave={({ educations, certificationIds, text }) => {
                    setEducationData(prev => ({
                        ...prev,
                        [eduMode]: {
                            educations,
                            certificationIds,
                            text
                        }
                    }));

                    setErrors(prev => {
                        const updated = { ...prev };
                        if (eduMode === "mandatory") delete updated.mandatoryEducation;
                        if (eduMode === "preferred") delete updated.preferredEducation;
                        return updated;
                    });
                }}


            />
        </Container>
    );
};

export default AddPosition;
