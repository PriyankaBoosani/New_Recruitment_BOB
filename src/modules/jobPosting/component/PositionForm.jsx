import React, { useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_icon from '../../../assets/upload_Icon.png';
import edit_icon from "../../../assets/edit_icon.png"
import view_icon from "../../../assets/view_icon.png"
import file_icon from "../../../assets/file_icon.png"
import { normalizeTitle, validateTitleOnType, validateApprovedOn } from "../validations/validateAddPosition";
import useViewIndent from "../hooks/useViewIndent";

const PositionForm = ({
    isViewMode = false,
    formData,
    errors,
    handleInputChange,
    indentFile,
    existingIndentPath,
    existingIndentName,
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


    const viewIndent = useViewIndent(existingIndentPath, existingIndentName);
    const isContractEmployment = employmentTypes.some(
        t =>
            String(t.id) === String(formData.employmentType) &&
            t.label?.toLowerCase().includes("contract")
    );

    const indentInputRef = useRef(null);

    const handleReplaceIndent = () => {
        if (isViewMode) return;

        setFormData(prev => ({
            ...prev,
            indentPath: null
        }));

        setIndentFile(null);

        setErrors(prev => { const { indentFile, ...rest } = prev; return rest; });

        const input = indentInputRef.current;

        if (input) {
            input.value = "";
            input.click();
        }
    };
    return (

        <>
            <div className={`position-form ${isViewMode ? "view-mode" : ""}`}>
                <Row className="g-4 mb-4 upload-indent-section">
                    <Col md={8} className="mt-3">
                        <Form.Group>
                            <Form.Label>Upload Indent <span className="text-danger">*</span></Form.Label>
                            <div
                                className={`upload-indent-box ${isViewMode ? "disabled" : ""}`}
                                onClick={() => {
                                    if (isViewMode) return;

                                    if (!existingIndentPath || indentFile) {
                                        indentInputRef.current?.click();
                                    }
                                }}

                            >
                                {indentFile ? (
                                    <div className="d-flex align-items-center justify-content-between w-100">

                                        {/* LEFT: file icon + name */}
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="file-icon">
                                                <img src={file_icon} alt="file_icon" className="icon-16" />
                                            </span>
                                            <div className="fw-semibold">{indentFile.name}</div>
                                        </div>

                                        {/* RIGHT: edit icon */}
                                        <div className="indent-actions">
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

                                    </div>
                                ) : existingIndentPath ? (
                                    <div className="d-flex align-items-center gap-3" >
                                        <span className="file-icon"><img src={file_icon} alt="file_icon" className="icon-16" /></span>
                                        <div>
                                            <div className="fw-semibold text-truncate" title={existingIndentName} >{existingIndentName}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted">
                                        <img src={upload_icon} alt="upload_icon" className="icon-40" />
                                        <div>Click to browse files</div>
                                        <span className="support">Supported formats: PDF, DOC, DOCX (Max 2 MB)</span>
                                    </div>
                                )}
                                {!indentFile && existingIndentPath && (
                                    <div className="indent-actions">
                                        {/* View */}
                                        <button
                                            type="button"
                                            className="icon-btn"
                                            onClick={(e) => {

                                                e.stopPropagation(); // UI concern stays in component
                                                viewIndent();
                                            }}

                                        >
                                            <img src={view_icon} alt="view_icon" className="icon-16" />
                                        </button>
                                        {/* Edit */}
                                        {!isViewMode && (
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
                                        )}

                                    </div>
                                )}

                            </div>
                            <input
                                id="indentFileInput"
                                ref={indentInputRef}
                                type="file"
                                hidden
                                disabled={isViewMode}
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
                            <Form.Select value={approvedBy} onChange={(e) => { setApprovedBy(e.target.value); setErrors(prev => ({ ...prev, approvedBy: "" })); }} disabled={isViewMode}>
                                <option value="">Select</option>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}{user.role ? ` (${user.role})` : ""}</option>)}
                            </Form.Select>
                            <ErrorMessage>{errors.approvedBy}</ErrorMessage>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Approved On <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={approvedOn}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setApprovedOn(value);

                                    setErrors(prev => ({
                                        ...prev,
                                        approvedOn: validateApprovedOn(value)
                                    }));
                                }}
                                disabled={isViewMode}
                            />

                            <ErrorMessage>{errors.approvedOn}</ErrorMessage>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={4}>
                        <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="position" value={formData.position} onChange={(e) => onPositionSelect(e.target.value)} disabled={isViewMode}>
                            <option value="">Select</option>
                            {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Form.Select>
                        <ErrorMessage>{errors.position}</ErrorMessage>
                    </Col>

                    <Col md={4}>
                        <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="department" value={formData.department} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">Select</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </Form.Select>
                        <ErrorMessage>{errors.department}</ErrorMessage>
                    </Col>

                    <Col md={4}>
                        <Form.Label>Total Vacancies <span className="text-danger">*</span></Form.Label>
                        <Form.Control name="vacancies" placeholder="Enter Vacancies" type="text" inputMode="numeric" pattern="[0-9]*" value={formData.vacancies} onChange={handleInputChange} disabled={isViewMode} />
                        <ErrorMessage>{errors.vacancies}</ErrorMessage>
                    </Col>

                    <Col md={4}><Form.Label>Min Age <span className="text-danger">*</span></Form.Label><Form.Control name="minAge" type="text" placeholder="Min Age" inputMode="numeric" value={formData.minAge} disabled={isViewMode} onChange={(e) => {
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
                    <Col md={4}><Form.Label>Max Age <span className="text-danger">*</span></Form.Label><Form.Control name="maxAge" type="text" placeholder="Max Age" inputMode="numeric" disabled={isViewMode} value={formData.maxAge} onChange={(e) => {
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
                        <Form.Select name="employmentType" value={formData.employmentType} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">Select</option>
                            {employmentTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </Form.Select>
                        <ErrorMessage>{errors.employmentType}</ErrorMessage>
                    </Col>

                    <Col md={4}><Form.Label>Contractual Period(Years)</Form.Label><Form.Control name="contractualPeriod" type="text" inputMode="numeric" value={isContractEmployment ? formData.contractualPeriod : ""} onChange={handleInputChange} disabled={!isContractEmployment || isViewMode} /></Col>
                    <Col md={4}>
                        <Form.Label>Grade / Scale <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="grade" value={formData.grade} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">Select</option>
                            {jobGrades.map(g => <option key={g.id} value={g.id}>{g.code} {g.scale ? `- ${g.scale}` : ""}</option>)}
                        </Form.Select>
                        <ErrorMessage>{errors.grade}</ErrorMessage>
                    </Col>

                    <Col md={4}>
                        <Form.Label>Enable Location Preference</Form.Label>
                        <Form.Check type="switch" id="enable-location" checked={formData.enableLocation} onChange={handleInputChange} name="enableLocation" disabled={isViewMode} />
                    </Col>

                    <Col md={6}>
                        <div className="d-flex justify-content-between align-items-center mb-1 mandedu">
                            <Form.Label className="mb-0">Mandatory Education <span className="text-danger">*</span></Form.Label>
                            <Button size="sm" disabled={isViewMode} onClick={() => onEducationClick("mandatory")} style={{ borderRadius: "10px" }}>+ Add</Button>
                        </div>
                        <Form.Control as="textarea" placeholder="Enter Mandatory Education" rows={4} readOnly value={educationData.mandatory.text || ""} disabled={isViewMode} />
                        <ErrorMessage>{errors.mandatoryEducation}</ErrorMessage>
                    </Col>

                    <Col md={6}>
                        <div className="d-flex justify-content-between align-items-center mb-1 mandedu">
                            <Form.Label className="mb-0">Preferred Education <span className="text-danger">*</span></Form.Label>
                            <Button size="sm" disabled={isViewMode} onClick={() => onEducationClick("preferred")} style={{ borderRadius: "10px" }}>+ Add</Button>
                        </div>
                        <Form.Control as="textarea" placeholder="Enter Preferred Education" rows={4} readOnly value={educationData.preferred.text || ""} disabled={isViewMode} />
                        <ErrorMessage>{errors.preferredEducation}</ErrorMessage>
                    </Col>

                    {/* Experience Row logic maintained for both mandatory/preferred */}
                    {['mandatoryExperience', 'preferredExperience'].map((expType) => (
                        <Col md={6} key={expType}>
                            <Form.Label>{expType === 'mandatoryExperience' ? 'Mandatory' : 'Preferred'} Experience <span className="text-danger">*</span></Form.Label>
                            <Row className="g-2 mb-2">
                                <Col md={6}>
                                    <Form.Select disabled={isViewMode} value={formData[expType].years} onChange={(e) => handleInputChange({ target: { name: `${expType}.years`, value: e.target.value } })}>
                                        <option value="">Select Years</option>
                                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Select disabled={isViewMode} value={formData[expType].months} onChange={(e) => handleInputChange({ target: { name: `${expType}.months`, value: e.target.value } })}>
                                        <option value="">Select Months</option>
                                        {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter Experience"
                                rows={3}
                                value={formData[expType].description} disabled={isViewMode}

                                onChange={(e) => {
                                    const { valid, value } = validateTitleOnType(e.target.value);

                                    if (!valid) {
                                        setErrors(prev => ({ ...prev, [expType]: "Only letters, numbers, spaces and . , - ( ) & : ; / are allowed" }));
                                        return;
                                    }

                                    setFormData(prev => ({ ...prev, [expType]: { ...prev[expType], description: value } }));

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
                            as="textarea" disabled={isViewMode}
                            rows={5}
                            name="responsibilities"
                            placeholder="Enter Roles & Responsibilities"
                            value={formData.responsibilities}
                            onChange={(e) => {
                                const { valid, value, message } = validateTitleOnType(e.target.value);

                                if (!valid) {
                                    setErrors(prev => ({
                                        ...prev,
                                        responsibilities: message
                                    }));
                                    return;
                                }

                                setFormData(prev => ({
                                    ...prev,
                                    responsibilities: value
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    responsibilities: ""
                                }));
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
                    <Col md={3}>
                        <Form.Label>Medical Required <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="medicalRequired" value={formData.medicalRequired} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">Select...</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Select>
                        <ErrorMessage>{errors.medicalRequired}</ErrorMessage>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default PositionForm;