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
import { useEffect } from "react";
import ConfirmUsePositionModal from "../component/ConfirmUsePositionModal";

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
        certifications,
        states
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

    const [stateDistributions, setStateDistributions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPosition, setPendingPosition] = useState(null);
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
    const handleUsePositionData = () => {
        if (!pendingPosition) return;

        setFormData(prev => ({
            ...prev,
            department: String(pendingPosition.deptId),
            minAge: pendingPosition.minAge ?? "",
            maxAge: pendingPosition.maxAge ?? "",
            grade: String(pendingPosition.gradeId ?? ""),
            responsibilities: pendingPosition.rolesResponsibilities ?? "",
            mandatoryEducation: pendingPosition.mandatoryEducation ?? "",
            preferredEducation: pendingPosition.preferredEducation ?? "",
            mandatoryExperience: {
                ...prev.mandatoryExperience,
                description: pendingPosition.mandatoryExperience ?? ""
            },
            preferredExperience: {
                ...prev.preferredExperience,
                description: pendingPosition.preferredExperience ?? ""
            }
        }));

        setPendingPosition(null);
        setShowConfirmModal(false);
    };

    const handleIgnorePositionData = () => {
        // Do NOT populate anything
        setPendingPosition(null);
        setShowConfirmModal(false);
    };

    const handleAddOrUpdateState = () => {
        if (!currentState.state || !currentState.vacancies) {
            alert("State and Vacancies are required");
            return;
        }

        const categoryTotal = Object.values(currentState.categories || {})
            .reduce((a, b) => a + Number(b || 0), 0);

        const disabilityTotal = Object.values(currentState.disabilities || {})
            .reduce((a, b) => a + Number(b || 0), 0);

        if (categoryTotal + disabilityTotal !== Number(currentState.vacancies)) {
            alert("Category + Disability total must match vacancies");
            return;
        }

        // ❌ prevent duplicate state
        if (
            editingIndex === null &&
            stateDistributions.some(s => s.state === currentState.state)
        ) {
            alert("This state is already added");
            return;
        }

        const updated = [...stateDistributions];

        if (editingIndex !== null) {
            // UPDATE
            updated.splice(editingIndex, 0, { ...currentState });
        } else {
            // ADD
            updated.push({ ...currentState });
        }

        setStateDistributions(updated);

        setCurrentState({
            state: "",
            vacancies: "",
            language: "",
            categories: {},
            disabilities: {},
        });

        setEditingIndex(null);
    };

    const handleEditState = (index) => {
        const row = stateDistributions[index];

        // Load row into form
        setCurrentState({
            state: row.state,
            vacancies: row.vacancies,
            language: row.language,
            categories: { ...row.categories },
            disabilities: { ...row.disabilities },
        });

        // Remove row so submit will replace it
        setStateDistributions(prev =>
            prev.filter((_, i) => i !== index)
        );

        setEditingIndex(index);
    };


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

    /* ---------- NATIONAL (toggle OFF) ---------- */
    const [nationalCategories, setNationalCategories] = useState({});
    const [nationalDisabilities, setNationalDisabilities] = useState({});

    /* ---------- CURRENT STATE (toggle ON) ---------- */
    const [currentState, setCurrentState] = useState({
        state: "",
        vacancies: "",
        language: "",
        categories: {},
        disabilities: {}
    });

    useEffect(() => {
        if (!reservationCategories.length) return;
        const obj = {};
        reservationCategories.forEach(c => (obj[c.code] = 0));
        setNationalCategories(obj);
    }, [reservationCategories]);

    useEffect(() => {
        if (!disabilityCategories.length) return;
        const obj = {};
        disabilityCategories.forEach(d => (obj[d.disabilityCode] = 0));
        setNationalDisabilities(obj);
    }, [disabilityCategories]);

    const nationalCategoryTotal = Object.values(nationalCategories)
        .reduce((a, b) => a + Number(b || 0), 0);

    const stateCategoryTotal = Object.values(currentState.categories || {})
        .reduce((a, b) => a + Number(b || 0), 0);




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
            approvedOn,

            currentState,
            reservationCategories,
            disabilityCategories,
            nationalCategories,
            nationalDisabilities,

            qualifications,
            certifications,
            stateDistributions
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
                                            p => String(p.id) === String(positionId)
                                        );

                                        if (!selected) return;

                                        // store temporarily
                                        setPendingPosition(selected);

                                        // set only position id for now
                                        setFormData(prev => ({
                                            ...prev,
                                            position: positionId
                                        }));

                                        // show confirmation modal
                                        setShowConfirmModal(true);
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
                                        {/* GENERAL */}
                                        <Col md={7}>
                                            <Card className="p-3">
                                                <h6 className="text-primary mb-3">General Category</h6>
                                                <Row className="g-3">
                                                    {reservationCategories.map(cat => (
                                                        <Col md={2} key={cat.id}>
                                                            <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                value={nationalCategories[cat.code] ?? 0}
                                                                onChange={e =>
                                                                    setNationalCategories(prev => ({
                                                                        ...prev,
                                                                        [cat.code]: e.target.value
                                                                    }))
                                                                }
                                                            />
                                                        </Col>
                                                    ))}
                                                    <Col md={2}>
                                                        <Form.Label className="small fw-semibold">Total</Form.Label>
                                                        <Form.Control disabled value={nationalCategoryTotal} />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>

                                        {/* DISABILITY — ENABLED */}
                                        <Col md={5}>
                                            <Card className="p-3">
                                                <h6 className="text-primary mb-3">Disability Category</h6>
                                                <Row className="g-3">
                                                    {disabilityCategories.map(d => (
                                                        <Col md={3} key={d.id}>
                                                            <Form.Label className="small fw-semibold">
                                                                {d.disabilityCode}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                value={nationalDisabilities[d.disabilityCode] ?? 0}
                                                                onChange={e =>
                                                                    setNationalDisabilities(prev => ({
                                                                        ...prev,
                                                                        [d.disabilityCode]: e.target.value
                                                                    }))
                                                                }
                                                            />
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
                                        {/* STATE META */}
                                        <Row className="g-3 mb-3">
                                            <Col md={4}>
                                                <Form.Label>State *</Form.Label>
                                                <Form.Select
                                                    value={currentState.state}
                                                    onChange={e =>
                                                        setCurrentState(prev => ({ ...prev, state: e.target.value }))
                                                    }
                                                >
                                                    <option value="">Select State</option>
                                                    {states.map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                            </Col>

                                            <Col md={4}>
                                                <Form.Label>Vacancies *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={currentState.vacancies}
                                                    onChange={e =>
                                                        setCurrentState(prev => ({ ...prev, vacancies: e.target.value }))
                                                    }
                                                />
                                            </Col>

                                            <Col md={4}>
                                                <Form.Label>Local Language of State</Form.Label>
                                                <Form.Control
                                                    value={currentState.language}
                                                    onChange={e =>
                                                        setCurrentState(prev => ({ ...prev, language: e.target.value }))
                                                    }
                                                />
                                            </Col>
                                        </Row>

                                        {/* GENERAL */}
                                        <Row className="g-4 mt-3">
                                            {/* GENERAL CATEGORY */}
                                            <Col md={7}>
                                                <Card className="p-3 h-100">
                                                    <h6 className="text-primary mb-3">General Category</h6>
                                                    <Row className="g-3">
                                                        {reservationCategories.map(cat => (
                                                            <Col md={2} key={cat.id}>
                                                                <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={currentState.categories?.[cat.code] ?? 0}
                                                                    onChange={e =>
                                                                        setCurrentState(prev => ({
                                                                            ...prev,
                                                                            categories: {
                                                                                ...prev.categories,
                                                                                [cat.code]: e.target.value
                                                                            }
                                                                        }))
                                                                    }
                                                                />
                                                            </Col>
                                                        ))}
                                                        <Col md={2}>
                                                            <Form.Label className="small fw-semibold">Total</Form.Label>
                                                            <Form.Control disabled value={stateCategoryTotal} />
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>

                                            {/* DISABILITY CATEGORY */}
                                            <Col md={5}>
                                                <Card className="p-3 h-100">
                                                    <h6 className="text-primary mb-3">Disability Category</h6>
                                                    <Row className="g-3">
                                                        {disabilityCategories.map(d => (
                                                            <Col md={3} key={d.id}>
                                                                <Form.Label className="small fw-semibold">
                                                                    {d.disabilityCode}
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={currentState.disabilities?.[d.disabilityCode] ?? 0}
                                                                    onChange={e =>
                                                                        setCurrentState(prev => ({
                                                                            ...prev,
                                                                            disabilities: {
                                                                                ...prev.disabilities,
                                                                                [d.disabilityCode]: e.target.value
                                                                            }
                                                                        }))
                                                                    }
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>


                                        <Button className="mt-3" onClick={handleAddOrUpdateState}>
                                            {editingIndex !== null ? "Update State" : "Add State"}
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
                                                {stateDistributions.map((row, index) => {
                                                    const disabilityTotal = Object.values(row.disabilities || {})
                                                        .reduce((a, b) => a + Number(b || 0), 0);

                                                    const categoryTotal = Object.values(row.categories || {})
                                                        .reduce((a, b) => a + Number(b || 0), 0);

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {states.find(s => s.id === row.state)?.name || "—"}
                                                            </td>
                                                            <td>{row.vacancies}</td>
                                                            <td>{row.language || "—"}</td>

                                                            {reservationCategories.map(cat => (
                                                                <td key={cat.code}>
                                                                    {row.categories?.[cat.code] ?? 0}
                                                                </td>
                                                            ))}

                                                            <td>{categoryTotal}</td>

                                                            {disabilityCategories.map(dis => (
                                                                <td key={dis.disabilityCode}>
                                                                    {row.disabilities?.[dis.disabilityCode] ?? 0}
                                                                </td>
                                                            ))}

                                                            <td>{disabilityTotal}</td>

                                                            <td className="text-center">
                                                                <Button
                                                                    size="sm"
                                                                    variant="link"
                                                                    onClick={() => handleEditState(index)}
                                                                >
                                                                    ✏️
                                                                </Button>

                                                                <Button
                                                                    size="sm"
                                                                    variant="link"
                                                                    className="text-danger"
                                                                    onClick={() =>
                                                                        setStateDistributions(prev =>
                                                                            prev.filter((_, i) => i !== index)
                                                                        )
                                                                    }
                                                                >
                                                                    🗑️
                                                                </Button>
                                                            </td>

                                                        </tr>
                                                    );
                                                })}
                                            </tbody>



                                        </table>                                    </>
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
                certifications={certifications}
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

            <ConfirmUsePositionModal
  show={showConfirmModal}
  onYes={handleUsePositionData}
  onNo={handleIgnorePositionData}
/>

        </Container>
    );
};

export default AddPosition;
