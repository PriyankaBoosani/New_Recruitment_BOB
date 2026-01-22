import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_icon from '../../../assets/upload_Icon.png';
import { useEffect } from "react";
import edit_icon from "../../../assets/edit_icon.png"
import view_icon from "../../../assets/view_icon.png"
import { normalizeTitle, TITLE_ALLOWED_PATTERN } from "../validations/validateAddPosition";
const PositionForm = ({
    isViewMode = false,
    formData,
    errors,
    handleInputChange,
    indentFile,
    existingIndentPath,
    setIndentFile,
    setErrors,
    setFormData,
    approvedBy,
    setApprovedBy,
    approvedOn,
    setApprovedOn,
    masterData: { positions, departments, employmentTypes, jobGrades, users },
    onPositionSelect,
    onEducationClick,
    educationData,
    YEAR_OPTIONS,
    MONTH_OPTIONS,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE_MB
}) => {
    const isContractEmployment =
        employmentTypes.find(
            t =>
                String(t.id) === String(formData.employmentType) &&
                t.label?.toLowerCase().includes("contract")
        ) !== undefined;

    useEffect(() => {
        if (!isContractEmployment && formData.contractualPeriod) {
            setFormData(prev => ({
                ...prev,
                contractualPeriod: ""
            }));
        }
    }, [isContractEmployment]);
    const handleReplaceIndent = () => {
        // clear backend file reference
        setFormData(prev => ({
            ...prev,
            indentPath: null // or whatever key you send to backend
        }));

        // clear UI state
        setIndentFile(null);

        // clear errors
        setErrors(prev => {
            const { indentFile, ...rest } = prev;
            return rest;
        });

        // reset file input so same file can be selected again
        const input = document.getElementById("indentFileInput");
        if (input) input.value = "";

        // open file picker
        input?.click();
    };


    return (

        <>
            <Row className="g-4 mb-4 upload-indent-section">
                <Col md={8} className="mt-3">
                    <Form.Group>
                        <Form.Label>Upload Indent <span className="text-danger">*</span></Form.Label>
                        <div
                            className={`upload-indent-box ${errors.indentFile ? "" : ""}`}
                            onClick={() => {
                                if (!existingIndentPath || indentFile) {
                                    document.getElementById("indentFileInput").click();
                                }
                            }}
                            
                        >
                            {indentFile ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="file-icon">📄</span>
                                    <div>
                                        <div className="fw-semibold">{indentFile.name}</div>
                                        <small className="text-muted">{(indentFile.size / 1024).toFixed(2)} KB</small>
                                    </div>
                                </div>
                            ) : existingIndentPath ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="file-icon">📄</span>
                                    <div>
                                        <div className="fw-semibold">Existing Indent</div>
                                        {/* <a href={existingIndentPath} target="_blank" rel="noopener noreferrer" className="text-primary" onClick={(e) => e.stopPropagation()}>
                                            View / Download
                                        </a> */}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted">
                                    <img src={upload_icon} alt="upload_icon" className="icon-40" />
                                    <div>Drag & drop your file here, or <br /><span className="textclick">Click to Upload</span></div>
                                    <span className="support">Supported formats: PDF, DOC, DOCX (Max 2 MB)</span>
                                </div>
                            )}
                            {!indentFile && existingIndentPath && (
                                
                                <div className="indent-actions">
                                    {/* View */}
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        title="View"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(existingIndentPath, "_blank");
                                        }}
                                    >
                                         <img src={view_icon} alt="edit_icon" className="icon-16" />
                                    </button>

                                    {/* Edit */}
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        title="Replace"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReplaceIndent();
                                        }}
                                    >
                                         <img src={edit_icon} alt="edit_icon" className="icon-16" />
                                    </button>
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
                                if (!ALLOWED_EXTENSIONS.includes(extension)) {
                                    setErrors(prev => ({ ...prev, indentFile: "Only PDF, DOC, and DOCX files are allowed" }));
                                    return;
                                }
                                if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
                                    setErrors(prev => ({ ...prev, indentFile: "File size must not exceed 2 MB" }));
                                    return;
                                }
                                setIndentFile(file);
                                setErrors(prev => { const { indentFile, ...rest } = prev; return rest; });
                            }}
                        />
                        <ErrorMessage>{errors.indentFile}</ErrorMessage>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Approved By <span className="text-danger">*</span></Form.Label>
                        <Form.Select value={approvedBy} onChange={(e) => { setApprovedBy(e.target.value); setErrors(prev => ({ ...prev, approvedBy: "" })); }}>
                            <option value="">Select</option>
                            {users.map(user => <option key={user.id} value={user.id}>{user.name}{user.role ? ` (${user.role})` : ""}</option>)}
                        </Form.Select>
                        <ErrorMessage>{errors.approvedBy}</ErrorMessage>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Approved On <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="date" value={approvedOn} onChange={(e) => { setApprovedOn(e.target.value); setErrors(prev => ({ ...prev, approvedOn: "" })); }} />
                        <ErrorMessage>{errors.approvedOn}</ErrorMessage>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={4}>
                    <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="position" value={formData.position} onChange={(e) => onPositionSelect(e.target.value)}>
                        <option value="">Select</option>
                        {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Form.Select>
                    <ErrorMessage>{errors.position}</ErrorMessage>
                </Col>

                <Col md={4}>
                    <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="department" value={formData.department} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                    </Form.Select>
                    <ErrorMessage>{errors.department}</ErrorMessage>
                </Col>

                <Col md={4}>
                    <Form.Label>Total Vacancies <span className="text-danger">*</span></Form.Label>
                    <Form.Control name="vacancies" placeholder="Enter Vacancies" type="text" inputMode="numeric" pattern="[0-9]*" value={formData.vacancies} onChange={handleInputChange} />
                    <ErrorMessage>{errors.vacancies}</ErrorMessage>
                </Col>

                <Col md={4}><Form.Label>Min Age <span className="text-danger">*</span></Form.Label><Form.Control name="minAge" type="text" inputMode="numeric" value={formData.minAge} onChange={(e) => {
                    let value = e.target.value;

                    // allow only digits
                    value = value.replace(/\D/g, "");

                    // limit to 2 digits
                    if (value.length > 2) return;

                    handleInputChange({
                        target: { name: "minAge", value }
                    });
                }} />
                    <ErrorMessage>{errors.minAge}</ErrorMessage></Col>
                <Col md={4}><Form.Label>Max Age <span className="text-danger">*</span></Form.Label><Form.Control name="maxAge" type="text" inputMode="numeric" value={formData.maxAge} onChange={(e) => {
                    let value = e.target.value;

                    value = value.replace(/\D/g, "");
                    if (value.length > 2) return;

                    handleInputChange({
                        target: { name: "maxAge", value }
                    });
                }} />
                    <ErrorMessage>{errors.maxAge}</ErrorMessage></Col>

                <Col md={4}>
                    <Form.Label>Type of Employment <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="employmentType" value={formData.employmentType} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {employmentTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </Form.Select>
                    <ErrorMessage>{errors.employmentType}</ErrorMessage>
                </Col>

                <Col md={4}><Form.Label>Contractual Period(Years)</Form.Label><Form.Control name="contractualPeriod" type="text" inputMode="numeric" value={formData.contractualPeriod} onChange={handleInputChange} disabled={!isContractEmployment} /></Col>
                <Col md={4}>
                    <Form.Label>Grade / Scale <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="grade" value={formData.grade} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {jobGrades.map(g => <option key={g.id} value={g.id}>{g.code} {g.scale ? `- ${g.scale}` : ""}</option>)}
                    </Form.Select>
                    <ErrorMessage>{errors.grade}</ErrorMessage>
                </Col>

                <Col md={4}>
                    <Form.Label>Enable Location Preference</Form.Label>
                    <Form.Check type="switch" id="enable-location" checked={formData.enableLocation} onChange={handleInputChange} name="enableLocation" />
                </Col>

                <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <Form.Label className="mb-0">Mandatory Education <span className="text-danger">*</span></Form.Label>
                        <Button size="sm" onClick={() => onEducationClick("mandatory")} style={{ borderRadius: "10px" }}>+ Add</Button>
                    </div>
                    <Form.Control as="textarea" rows={4} readOnly value={educationData.mandatory.text || ""} />
                    <ErrorMessage>{errors.mandatoryEducation}</ErrorMessage>
                </Col>

                <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <Form.Label className="mb-0">Preferred Education <span className="text-danger">*</span></Form.Label>
                        <Button size="sm" onClick={() => onEducationClick("preferred")} style={{ borderRadius: "10px" }}>+ Add</Button>
                    </div>
                    <Form.Control as="textarea" rows={4} readOnly value={educationData.preferred.text || ""} />
                    <ErrorMessage>{errors.preferredEducation}</ErrorMessage>
                </Col>

                {/* Experience Row logic maintained for both mandatory/preferred */}
                {['mandatoryExperience', 'preferredExperience'].map((expType) => (
                    <Col md={6} key={expType}>
                        <Form.Label>{expType === 'mandatoryExperience' ? 'Mandatory' : 'Preferred'} Experience <span className="text-danger">*</span></Form.Label>
                        <Row className="g-2 mb-2">
                            <Col md={6}>
                                <Form.Select value={formData[expType].years} onChange={(e) => handleInputChange({ target: { name: `${expType}.years`, value: e.target.value } })}>
                                    <option value="">Select Years</option>
                                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Select value={formData[expType].months} onChange={(e) => handleInputChange({ target: { name: `${expType}.months`, value: e.target.value } })}>
                                    <option value="">Select Months</option>
                                    {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData[expType].description}
                            onChange={(e) => {
                                let value = normalizeTitle(e.target.value);

                                if (!TITLE_ALLOWED_PATTERN.test(value)) {
                                    setErrors(prev => ({
                                        ...prev,
                                        [expType]: "Only letters, numbers, spaces and . , - ( ) & : ; / are allowed"
                                    }));
                                    return;
                                }

                                setFormData(prev => ({
                                    ...prev,
                                    [expType]: {
                                        ...prev[expType],
                                        description: value
                                    }
                                }));

                                setErrors(prev => ({ ...prev, [expType]: "" }));
                            }}

                            onBlur={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    [expType]: {
                                        ...prev[expType],
                                        description: normalizeTitle(prev[expType].description)
                                    }
                                }));
                            }}
                        />


                        <ErrorMessage>{errors[expType]}</ErrorMessage>
                    </Col>
                ))}

                <Col md={6}>
                    <Form.Label>Roles & Responsibilities <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={(e) => {
                            const value = normalizeTitle(e.target.value);

                            if (!TITLE_ALLOWED_PATTERN.test(value)) {
                                setErrors(prev => ({
                                    ...prev,
                                    responsibilities:
                                        "Only letters, numbers, spaces and . , - ( ) & : ; / are allowed"
                                }));
                                return;
                            }

                            setFormData(prev => ({
                                ...prev,
                                responsibilities: value
                            }));

                            setErrors(prev => ({ ...prev, responsibilities: "" }));
                        }}
                        onBlur={() => {
                            setFormData(prev => ({
                                ...prev,
                                responsibilities: normalizeTitle(prev.responsibilities)
                            }));
                        }}
                    />





                    <ErrorMessage>{errors.responsibilities}</ErrorMessage>

                </Col>
                <Col md={2}>
                    <Form.Label>Medical Required <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="medicalRequired" value={formData.medicalRequired} onChange={handleInputChange}>
                        <option value="">Select...</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Form.Select>
                    <ErrorMessage>{errors.medicalRequired}</ErrorMessage>
                </Col>
            </Row>
        </>
    );
};

export default PositionForm;