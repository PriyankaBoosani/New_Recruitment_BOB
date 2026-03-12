import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../../style/css/EducationModal.css";
import { validateEducationModal } from "../validations/validateEducationModal";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import delete_icon from "../../../assets/delete_icon.png"
import { useTranslation } from "react-i18next";
import Select from "react-select";

const createRow = () => ({
    educationTypeId: "",
    educationQualificationsId: "",
    specializationId: "",
});

export default function EducationModal({
    show,
    mode,
    initialData,
    onHide,
    onSave,
    educationTypes = [],
    qualifications = [],
    specializations = [],
    certifications = [],
}) {
    const { t } = useTranslation(["addPosition", "common", "validation"]);
    const [errors, setErrors] = useState({});
    const [rows, setRows] = useState([createRow()]);
    const [certIds, setCertIds] = useState([""]);

    useEffect(() => {
        if (!show) return;

        setRows(
            initialData?.educations?.length
                ? initialData.educations
                : [createRow()]
        );

        setCertIds(
            initialData?.certificationIds?.length
                ? initialData.certificationIds
                : [""]
        );
    }, [show, initialData]);

    const getLabel = (list, id, key = "label") =>
        list.find(i => i.id === id)?.[key] || "";

    const degreeText = rows
        .filter(r =>
            r.educationTypeId &&
            r.educationQualificationsId
        )
        .map((r, i) => {
            const type = getLabel(educationTypes, r.educationTypeId);
            const degree = getLabel(qualifications, r.educationQualificationsId, "name");
            const spec = getLabel(specializations, r.specializationId);

            if (!type || !degree) return null;

            return `${i > 0 ? "OR " : ""}${type} ${degree}${spec ? ` in ${spec}` : ""}`;
        })

        .join(" ");


    const addRow = () => {
        setRows([...rows, createRow(false)]);
    };

    const updateRow = (i, field, value) => {
        const copy = [...rows];
        copy[i][field] = value;

        // if degree changes, wipe specialization
        if (field === "educationQualificationsId") {
            copy[i].specializationId = "";
        }

        setRows(copy);

        // clear errors (unchanged)
        setErrors(prev => {
            if (!prev.rows?.[i]?.[field]) return prev;
            const updated = { ...prev };
            updated.rows = [...updated.rows];
            updated.rows[i] = { ...updated.rows[i], [field]: "" };
            return updated;
        });
    };

    const removeRow = (index) => {
        setRows(prev =>
            prev.length > 1
                ? prev.filter((_, i) => i !== index)
                : [createRow()]
        );
    };
    const getSpecializationsForDegree = (degreeId) => {
        if (!degreeId) return [];
        return specializations.filter(
            s => s.educationQualificationsId === degreeId
        );
    };

    const certText = certIds
        .map(id => certifications.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(" OR ");


    let finalText = "";

    if (degreeText) {
        finalText += `Education Requirements:\n${degreeText}\n`;
        finalText += `Certifications: ${certText || "None"}`;
    } else if (certText) {
        finalText += `Certifications: ${certText}`;
    }

    const sortedCertifications = [...certifications].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    return (
        <Modal show={show} onHide={onHide} size="lg" scrollable centered className="edu-modal">
            <Modal.Header closeButton className="edu-modal-header">
                <Modal.Title className="f16 bluecol">
                    {mode === "mandatory"
                        ? t("addPosition:add_mandatory_education")
                        : t("addPosition:add_preferred_education")}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {rows.map((row, idx) => (
                    <Row key={idx} className="mb-3 align-items-center">

                        <Col md={3}>
                            <Select
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                    }}
                                value={[
                                    { value: "", label: t("common:select_type") },
                                    ...educationTypes.map(t => ({
                                        value: t.id,
                                        label: t.label
                                    }))
                                ].find(option => String(option.value) === String(row.educationTypeId))}
                                onChange={(selected) =>
                                    updateRow(idx, "educationTypeId", selected ? selected.value : "")
                                }
                                options={[
                                    { value: "", label: t("common:select_type") },
                                    ...educationTypes.map(t => ({
                                        value: t.id,
                                        label: t.label
                                    }))
                                ]}
                            />

                            <div className="edu-error-space">
                                <ErrorMessage>
                                    {errors.rows?.[idx]?.educationTypeId && t(errors.rows[idx].educationTypeId)}
                                </ErrorMessage>
                            </div>

                        </Col>

                        <Col md={4}>
                            <Select
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                    }}
                                value={[
                                    { value: "", label: t("common:select_education") },
                                    ...qualifications.map(q => ({
                                        value: q.id,
                                        label: q.name
                                    }))
                                ].find(option => String(option.value) === String(row.educationQualificationsId))}
                                onChange={(selected) =>
                                    updateRow(idx, "educationQualificationsId", selected ? selected.value : "")
                                }
                                options={[
                                    { value: "", label: t("common:select_education") },
                                    ...qualifications.map(q => ({
                                        value: q.id,
                                        label: q.name
                                    }))
                                ]}
                            />

                            <div className="edu-error-space">
                                <ErrorMessage>
                                    {errors.rows?.[idx]?.educationQualificationsId && t(errors.rows[idx].educationQualificationsId)}
                                </ErrorMessage>

                            </div>
                        </Col>

                        <Col md={4}>
                            <Select
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                    }}
                                value={[
                                    { value: "", label: t("common:select_specialization") },
                                    ...getSpecializationsForDegree(row.educationQualificationsId).map(s => ({
                                        value: s.id,
                                        label: s.label
                                    }))
                                ].find(option => String(option.value) === String(row.specializationId))}
                                onChange={(selected) =>
                                    updateRow(idx, "specializationId", selected ? selected.value : "")
                                }
                                options={[
                                    { value: "", label: t("common:select_specialization") },
                                    ...getSpecializationsForDegree(row.educationQualificationsId).map(s => ({
                                        value: s.id,
                                        label: s.label
                                    }))
                                ]}
                            />

                            <div className="edu-error-space">
                                <ErrorMessage>
                                    {errors.rows?.[idx]?.specializationId && t(errors.rows[idx].specializationId)}
                                </ErrorMessage></div>
                        </Col>
                        <Col md={1} className="px-1">

                            {rows.length > 1 && (
                                <Button
                                    variant="link"
                                    className="p-0 text-danger"
                                    onClick={() => removeRow(idx)}
                                    title={t("common:remove")}
                                >
                                    <img src={delete_icon} alt="delete_icon" className="icon-16" />
                                </Button>
                            )}
                            <div className="edu-error-space"></div>
                        </Col>
                    </Row>
                ))}
                {errors.rows?._error && (
                    <div className="mt-2">
                        <ErrorMessage>{t(errors.rows._error)}</ErrorMessage>
                    </div>
                )}

                <Button variant="none" onClick={addRow} className="edu-btn">
                    {t("addPosition:add_degree")}
                </Button>


                <Col md={6} className="mt-4">
                    <h6 className="f14 bluecol">{t("addPosition:certifications_optional")}</h6>

                    {certIds.map((id, i) => (
                        <Row key={i} className="mb-2 align-items-center">
                            <Col md={10}>
                                <Select
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                    }}
                                    value={[
                                        { value: "", label: t("common:select_certification") },
                                        ...sortedCertifications.map(c => ({
                                            value: c.id,
                                            label: c.name
                                        }))
                                    ].find(option => String(option.value) === String(id))}
                                    onChange={(selected) => {
                                        const copy = [...certIds];
                                        copy[i] = selected ? selected.value : "";
                                        setCertIds(copy);
                                    }}
                                    options={[
                                        { value: "", label: t("common:select_certification") },
                                        ...sortedCertifications.map(c => ({
                                            value: c.id,
                                            label: c.name
                                        }))
                                    ]}
                                />
                            </Col>

                            <Col md={1} className="text-center">
                                {certIds.length > 1 && (
                                    <Button
                                        variant="link"
                                        className="p-0 text-danger"
                                        onClick={() =>
                                            setCertIds(prev => prev.filter((_, x) => x !== i))
                                        }
                                    >
                                        <img src={delete_icon} alt="delete_icon" className="icon-16" />
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}
                </Col>

                <Button variant="none" onClick={() => setCertIds([...certIds, ""])} className="edu-btn">
                    {t("addPosition:add_certification")}
                </Button>



                <div className="mt-4 p-3 bg-light border rounded result">
                    <span className="f14">{t("addPosition:result_preview")}</span>
                    <pre className="mt-2 mb-0">{finalText}</pre>
                </div>
            </Modal.Body>

            <Modal.Footer className="edu-modal-footer">
                <Button variant="outline-secondary" className="cancelbtn" onClick={onHide}>{t("common:cancel")}</Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        const validationErrors = validateEducationModal({
                            rows,
                            mode,
                        });

                        if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                        }

                        const filledRows = rows.filter(
                            r => r.educationTypeId && r.educationQualificationsId
                        );

                        // 🚨 Only enforce required rule in mandatory mode
                        if (mode === "mandatory" && filledRows.length === 0) {
                            setErrors({
                                rows: { _error: "validation:degree_required" }
                            });
                            return;
                        }

                        setErrors({});

                        const payload = {
                            educations: filledRows.map(r => ({
                                educationTypeId: r.educationTypeId,
                                educationQualificationsId: r.educationQualificationsId,
                                specializationId: r.specializationId || null
                            })),
                            certificationIds: certIds.filter(Boolean),
                            text: finalText,
                        };

                        onSave(payload);
                        onHide();
                    }}
                >
                    {t("common:save")}
                </Button>

            </Modal.Footer>
        </Modal>
    );
}
