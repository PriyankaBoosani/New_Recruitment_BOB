import React, { useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import upload_icon from '../../../assets/upload_Icon.png';
import edit_icon from "../../../assets/edit_icon.png"
import view_icon from "../../../assets/view_icon.png"
import file_icon from "../../../assets/file_icon.png"
import { normalizeTitle, validateTitleOnType, validateApprovedOn } from "../validations/validateAddPosition";
import useViewIndent from "../hooks/useViewIndent";
import { OverlayTrigger, Popover } from "react-bootstrap";
import I_icon from '../../../assets/I_icon.png';
import { useTranslation } from "react-i18next";



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
    const { t } = useTranslation(["addPosition", "common", "validation"]);
    const renderError = (e) => {
        if (!e) return "";
        if (typeof e === "string") return t(e);
        if (typeof e === "object" && e.key) return t(e.key, e.params);
        return "";
    };

    const selectedGrade = jobGrades.find(
        g => String(g.id) === String(formData.grade)
    );
    const salaryPopover = (
        <Popover id="salary-popover">
            <Popover.Header as="h6"> {t("addPosition:salary_range")}</Popover.Header>
            <Popover.Body>
                <div><strong>{t("addPosition:min_salary")}:</strong> {selectedGrade?.minSalary ?? "-"}</div>
                <div><strong>{t("addPosition:max_salary")}:</strong> {selectedGrade?.maxSalary ?? "-"}</div>
            </Popover.Body>
        </Popover>
    );



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
                            <Form.Label>{t("addPosition:upload_indent")} <span className="text-danger">*</span></Form.Label>
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
                                                title={t("common:replace")}
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
                                        <div>{t("addPosition:click_to_browse")}</div>
                                        <span className="support">{t("addPosition:supported_formats")}</span>
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
                                                title={t("common:replace")}
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
                                        setErrors(prev => ({ ...prev, indentFile: "validation:file_invalid_type" }));
                                        return;
                                    }
                                    if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
                                        setErrors(prev => ({
                                            ...prev,
                                            indentFile: { key: "validation:file_too_large", params: { size: 2 } }
                                        }));
                                        return;
                                    }
                                    setIndentFile(file);
                                    setErrors(prev => { const { indentFile, ...rest } = prev; return rest; });
                                }}
                            />
                            <ErrorMessage>{renderError(errors.indentFile)}</ErrorMessage>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("addPosition:approved_by")} <span className="text-danger">*</span></Form.Label>
                            <Form.Select value={approvedBy} onChange={(e) => { setApprovedBy(e.target.value); setErrors(prev => ({ ...prev, approvedBy: "" })); }} disabled={isViewMode}>
                                <option value="">{t("common:select")}</option>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}{user.role ? ` (${user.role})` : ""}</option>)}
                            </Form.Select>
                            <ErrorMessage>{renderError(errors.approvedBy)}</ErrorMessage>

                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("addPosition:approved_on")} <span className="text-danger">*</span></Form.Label>
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

                            <ErrorMessage>{renderError(errors.approvedOn)}</ErrorMessage>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={4}>
                        <Form.Label>{t("addPosition:position")} <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="position" value={formData.position} onChange={(e) => onPositionSelect(e.target.value)} disabled={isViewMode}>
                            <option value="">{t("common:select")}</option>
                            {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Form.Select>
                        <ErrorMessage>{renderError(errors.position)}</ErrorMessage>
                    </Col>

                    <Col md={4}>
                        <Form.Label>{t("addPosition:department")} <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="department" value={formData.department} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">{t("common:select")}</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </Form.Select>
                        <ErrorMessage>{renderError(errors.department)}</ErrorMessage>
                    </Col>

                    <Col md={4}>
                        <Form.Label>{t("addPosition:total_vacancies")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control name="vacancies" maxLength={10} placeholder={t("addPosition:enter_vacancies")} type="text" inputMode="numeric" pattern="[0-9]*" value={formData.vacancies} onChange={handleInputChange} disabled={isViewMode} />
                        <ErrorMessage>{renderError(errors.vacancies)}</ErrorMessage>
                    </Col>

                    <Col md={4}><Form.Label>{t("addPosition:min_age")} <span className="text-danger">*</span></Form.Label><Form.Control name="minAge" type="text" placeholder={t("addPosition:min_age")} inputMode="numeric" value={formData.minAge} disabled={isViewMode} onChange={(e) => {
                        let value = e.target.value;

                        // allow only digits
                        value = value.replace(/\D/g, "");

                        // limit to 2 digits
                        if (value.length > 2) return;

                        handleInputChange({
                            target: { name: "minAge", value }
                        });
                    }} />
                        <ErrorMessage>{renderError(errors.minAge)}</ErrorMessage></Col>
                    <Col md={4}><Form.Label>{t("addPosition:max_age")}<span className="text-danger">*</span></Form.Label><Form.Control name="maxAge" type="text" placeholder={t("addPosition:max_age")} inputMode="numeric" disabled={isViewMode} value={formData.maxAge} onChange={(e) => {
                        let value = e.target.value;

                        value = value.replace(/\D/g, "");
                        if (value.length > 2) return;

                        handleInputChange({
                            target: { name: "maxAge", value }
                        });
                    }} />
                        <ErrorMessage>{renderError(errors.maxAge)}</ErrorMessage></Col>

                    <Col md={4}>
                        <Form.Label>{t("addPosition:employment_type")} <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="employmentType" value={formData.employmentType} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">{t("common:select")}</option>
                            {employmentTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </Form.Select>
                        <ErrorMessage>{renderError(errors.employmentType)}</ErrorMessage>
                    </Col>

                    <Col md={4}><Form.Label>{t("addPosition:contractual_period")}</Form.Label><Form.Control name="contractualPeriod" type="text" inputMode="numeric" value={isContractEmployment ? formData.contractualPeriod : ""} onChange={handleInputChange} disabled={!isContractEmployment || isViewMode} /></Col>
                    <Col md={4}>
                        <Form.Label className="d-flex align-items-center gap-2">
                            {t("addPosition:grade_scale")} <span className="text-danger">*</span>

                            {selectedGrade && (
                                <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={salaryPopover}
                                    rootClose
                                >
                                    <span
                                        style={{ cursor: "pointer", color: "#0d6efd" }}
                                        title={t("addPosition:view_salary_range")}
                                    >
                                        <img src={I_icon} alt="info_icon" className="icon-18" />
                                    </span>
                                </OverlayTrigger>
                            )}
                        </Form.Label>

                        <Form.Select name="grade" value={formData.grade} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">{t("common:select")}</option>
                            {jobGrades.map(g => <option key={g.id} value={g.id}>{g.code} {g.scale ? `- ${g.scale}` : ""}</option>)}
                        </Form.Select>

                        <ErrorMessage>{renderError(errors.grade)}</ErrorMessage>
                    </Col>


                    <Col md={4}>
                        <Form.Label>{t("addPosition:enable_location_pref")}</Form.Label>
                        <Form.Check type="switch" id="enable-location" checked={formData.enableLocation} onChange={handleInputChange} name="enableLocation" disabled={isViewMode} />
                    </Col>

                    <Col md={6}>
                        <div className="d-flex justify-content-between align-items-center mb-1 mandedu">
                            <Form.Label className="mb-0">{t("addPosition:mandatory_education")} <span className="text-danger">*</span></Form.Label>
                            <Button size="sm" disabled={isViewMode} onClick={() => onEducationClick("mandatory")} style={{ borderRadius: "10px" }}>{t("addPosition:add")}</Button>
                        </div>
                        <Form.Control as="textarea" placeholder={t("addPosition:enter_mandatory_education")} rows={4} readOnly value={educationData.mandatory.text || ""} disabled={isViewMode} />
                        <ErrorMessage>{renderError(errors.mandatoryEducation)}</ErrorMessage>
                    </Col>

                    <Col md={6}>
                        <div className="d-flex justify-content-between align-items-center mb-1 mandedu">
                            <Form.Label className="mb-0">{t("addPosition:preferred_education")} <span className="text-danger">*</span></Form.Label>
                            <Button size="sm" disabled={isViewMode} onClick={() => onEducationClick("preferred")} style={{ borderRadius: "10px" }}>{t("addPosition:add")}</Button>
                        </div>
                        <Form.Control as="textarea" placeholder={t("addPosition:enter_preferred_education")} rows={4} readOnly value={educationData.preferred.text || ""} disabled={isViewMode} />
                        <ErrorMessage>{renderError(errors.preferredEducation)}</ErrorMessage>
                    </Col>

                    {/* Experience Row logic maintained for both mandatory/preferred */}
                    {['mandatoryExperience', 'preferredExperience'].map((expType) => (
                        <Col md={6} key={expType}>
                            <Form.Label>{expType === 'mandatoryExperience' ? t("addPosition:mandatory_experience") : t("addPosition:preferred_experience")} <span className="text-danger">*</span></Form.Label>
                            <Row className="g-2 mb-2">
                                <Col md={6}>
                                    <Form.Select disabled={isViewMode} value={formData[expType].years} onChange={(e) => handleInputChange({ target: { name: `${expType}.years`, value: e.target.value } })}>
                                        <option value="">{t("common:select_years")}</option>
                                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Select disabled={isViewMode} value={formData[expType].months} onChange={(e) => handleInputChange({ target: { name: `${expType}.months`, value: e.target.value } })}>
                                        <option value="">{t("common:select_months")}</option>
                                        {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Form.Control
                                as="textarea"
                                maxLength={2000}
                                placeholder={
                                    expType === "mandatory"
                                        ? t("addPosition:enter_mandatory_experience")
                                        : t("addPosition:enter_preferred_experience")
                                }
                                rows={3}
                                value={formData[expType].description} disabled={isViewMode}

                                onChange={(e) => {
                                    const { valid, value } = validateTitleOnType(e.target.value);

                                    if (!valid) {
                                        setErrors(prev => ({ ...prev, [expType]: "validation:title_invalid_chars_extended" }));
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


                            <ErrorMessage>{renderError(errors[expType])}</ErrorMessage>

                        </Col>
                    ))}

                    <Col md={6}>
                        <Form.Label>{t("addPosition:roles_responsibilities")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea" disabled={isViewMode}
                            rows={5}
                            maxLength={2000}
                            name="responsibilities"
                            placeholder={t("addPosition:enter_roles")}
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
                        <ErrorMessage>{renderError(errors.responsibilities)}</ErrorMessage>

                    </Col>
                    <Col md={3}>
                        <Form.Label>{t("addPosition:medical_required")} <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="medicalRequired" value={formData.medicalRequired} onChange={handleInputChange} disabled={isViewMode}>
                            <option value="">{t("common:select")}</option>
                            <option value="yes">{t("common:yes")}</option>
                            <option value="no">{t("common:no")}</option>
                        </Form.Select>
                        <ErrorMessage>{renderError(errors.medicalRequired)}</ErrorMessage>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default PositionForm;