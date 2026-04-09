import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
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
  duration: "",
  gpa: "",
  percentage: ""
});

const createGroup = () => ({
  educations: [createRow()]
});

const createCertRow = () => ({
  certificationId: ""
});

const createCertGroup = () => ({
  certifications: [createCertRow()]
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
    const [groups, setGroups] = useState([createGroup()]);
    const [certGroups, setCertGroups] = useState([createCertGroup()]);

    

    useEffect(() => {
        if (!show) return;

        // Debug: Log the incoming data
        console.log('EducationModal - initialData:', initialData);
        console.log('EducationModal - mode:', mode);

        // The groups from mapEduRulesToModalData have educations property
        setGroups(initialData?.groups?.length ? initialData.groups : [createGroup()]);
        
        // The certGroups from mapEduRulesToModalData have certifications property
        setCertGroups(initialData?.certGroups?.length ? initialData.certGroups : [createCertGroup()]);
    }, [show, initialData, mode]);

    const getLabel = (list, id, key = "label") =>
        list.find(i => i.id === id)?.[key] || "";

    // const degreeText = rows
    //     .filter(r =>
    //         r.educationTypeId &&
    //         r.educationQualificationsId
    //     )
    //     .map((r, i) => {
    //         const type = getLabel(educationTypes, r.educationTypeId);
    //         const degree = getLabel(qualifications, r.educationQualificationsId, "name");
    //         const spec = getLabel(specializations, r.specializationId);

    //         if (!type || !degree) return null;

    //         return `${i > 0 ? "OR " : ""}${type} ${degree}${spec ? ` in ${spec}` : ""}`;
    //     })

    //     .join(" ");

const degreeText = groups
  .map(group => {
    // Check if group has educations property and it's an array
    if (!group || !Array.isArray(group.educations)) {
      return null;
    }
    
    const groupText = group.educations
      .filter(r => r.educationTypeId && r.educationQualificationsId)
      .map(r => {
        const type = getLabel(educationTypes, r.educationTypeId);
        const degree = getLabel(qualifications, r.educationQualificationsId, "name");
        const spec = getLabel(specializations, r.specializationId);

        let extra = [];
        if (r.duration) extra.push(`Duration: ${r.duration}`);
        if (r.gpa) extra.push(`GPA: ${r.gpa}`);
        if (r.percentage) extra.push(`%: ${r.percentage}`);

        const extraText = extra.length ? ` [${extra.join(", ")}]` : "";

        return `${type} ${degree}${spec ? ` in ${spec}` : ""}${extraText}`;
      })
      .join(" AND ");

    return groupText ? `(${groupText})` : null;
  })
  .filter(Boolean)
  .join("\nOR\n");

    // const addRow = () => {
    //     setRows([...rows, createRow(false)]);
    // };
    const addGroup = () => {
  setGroups([...groups, createGroup()]);
};

    const addRow = (groupIndex) => {
  const copy = [...groups];
  copy[groupIndex].educations.push(createRow());
  setGroups(copy);
};


    // const updateRow = (i, field, value) => {
    //     const copy = [...rows];
    //     copy[i][field] = value;

    //     // if degree changes, wipe specialization
    //     if (field === "educationQualificationsId") {
    //         copy[i].specializationId = "";
    //     }

    //     setRows(copy);

    //     // clear errors (unchanged)
    //     setErrors(prev => {
    //         if (!prev.rows?.[i]?.[field]) return prev;
    //         const updated = { ...prev };
    //         updated.rows = [...updated.rows];
    //         updated.rows[i] = { ...updated.rows[i], [field]: "" };
    //         return updated;
    //     });
    // };
const updateRow = (gIdx, rIdx, field, value) => {
  const copy = [...groups];
  copy[gIdx].educations[rIdx][field] = value;
  setGroups(copy);
};
    // const removeRow = (index) => {
    //     setRows(prev =>
    //         prev.length > 1
    //             ? prev.filter((_, i) => i !== index)
    //             : [createRow()]
    //     );
    // };

   const removeRow = (gIdx, rIdx) => {
  const copy = [...groups];

  if (copy[gIdx].educations.length === 1) {
    // reset instead of delete
    copy[gIdx].educations[0] = createRow();
  } else {
    copy[gIdx].educations.splice(rIdx, 1);
  }

  setGroups(copy);
};
const removeGroup = (gIdx) => {
  if (groups.length === 1) return;

  setGroups(groups.filter((_, i) => i !== gIdx));
};

// Certification group functions
const addCertGroup = () => {
  setCertGroups([...certGroups, createCertGroup()]);
};

const addCertRow = (certGroupIndex) => {
  const copy = [...certGroups];
  // Initialize certifications if it doesn't exist
  if (!copy[certGroupIndex].certifications) {
    copy[certGroupIndex].certifications = [];
  }
  copy[certGroupIndex].certifications.push(createCertRow());
  setCertGroups(copy);
};

const updateCertRow = (cgIdx, crIdx, field, value) => {
  const copy = [...certGroups];
  // Initialize certifications if it doesn't exist
  if (!copy[cgIdx].certifications) {
    copy[cgIdx].certifications = [];
  }
  copy[cgIdx].certifications[crIdx][field] = value;
  setCertGroups(copy);
};

const removeCertRow = (cgIdx, crIdx) => {
  const copy = [...certGroups];

  // Initialize certifications if it doesn't exist
  if (!copy[cgIdx].certifications) {
    copy[cgIdx].certifications = [];
  }

  if (copy[cgIdx].certifications.length === 1) {
    // reset instead of delete
    copy[cgIdx].certifications[0] = createCertRow();
  } else {
    copy[cgIdx].certifications.splice(crIdx, 1);
  }

  setCertGroups(copy);
};

const removeCertGroup = (cgIdx) => {
  if (certGroups.length === 1) return;

  setCertGroups(certGroups.filter((_, i) => i !== cgIdx));
};
    const getSpecializationsForDegree = (degreeId) => {
        if (!degreeId) return [];
        return specializations.filter(
            s => s.educationQualificationsId === degreeId
        );
    };

    const certText = certGroups
  .map(certGroup => {
    // Check if certGroup has certifications property and it's an array
    if (!certGroup || !Array.isArray(certGroup.certifications)) {
      return null;
    }
    
    const groupText = certGroup.certifications
      .filter(cr => cr.certificationId)
      .map(cr => {
        const cert = certifications.find(c => c.id === cr.certificationId);
        return cert ? cert.name : "";
      })
      .filter(Boolean)
      .join(" AND ");

    return groupText ? `(${groupText})` : null;
  })
  .filter(Boolean)
  .join("\nOR\n");


    let finalText = "";

    if (degreeText) {
        finalText += `Education Requirements:\n${degreeText}\n`;
        finalText += `Certifications: ${certText || "None"}`;
    } else if (certText) {
        finalText += `Certifications: ${certText}`;
    }

    const filteredCertifications = (certGroup, crIdx) => {
        return certifications
            .filter(c => c.name?.toLowerCase() !== "other")
            .filter(c => {
                // Filter out certifications already selected in other rows within the same group
                const alreadySelected = (certGroup.certifications || [])
                    .some((certRow, index) => index !== crIdx && certRow.certificationId === c.id);
                return !alreadySelected;
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" scrollable centered className="edu-modal">
            <Modal.Header closeButton className="edu-modal-header">
                <Modal.Title className="f16 bluecol">
                    {mode === "mandatory"
                        ? t("addPosition:add_mandatory_education")
                        : t("addPosition:add_preferred_education")}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {groups.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                        <div className="group-box">
                            <div className="group-header">
                                <strong>Education Group {gIdx + 1}</strong>
                                {groups.length > 1 && (
                                    <Button
                                        onClick={() => removeGroup(gIdx)}
                                        disabled={groups.length === 1}
                                        variant="none"
                                    >
                                        {/* Delete Group */}
                                        <img src={delete_icon} alt="delete_icon" className="icon-16" />
                                    </Button>
                                )}
                            </div>

                            {(group && Array.isArray(group.educations) ? group.educations : []).map((row, rIdx) => {
                                // ✅ ADD THIS (VERY IMPORTANT)
                                const flatIndex =
                                    groups.slice(0, gIdx).reduce((acc, g) => acc + (g && Array.isArray(g.educations) ? g.educations.length : 0), 0) + rIdx;

                                return (
                                    <Row key={rIdx} className="mb-3 align-items-center">
                                        {/* ✅ Education Type */}
                                        <Col md={2}>
                                            <Select
                                                classNamePrefix="react-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                                value={educationTypes
                                                    .map(t => ({ value: t.id, label: t.label }))
                                                    .find(opt => String(opt.value) === String(row.educationTypeId))}
                                                onChange={(selected) =>
                                                    updateRow(gIdx, rIdx, "educationTypeId", selected?.value || "")
                                                }
                                                options={educationTypes.map(t => ({
                                                    value: t.id,
                                                    label: t.label
                                                }))}
                                                placeholder="Type"
                                            />
                                            <ErrorMessage>
                                                {errors.rows?.[flatIndex]?.educationTypeId &&
                                                    t(errors.rows[flatIndex].educationTypeId)}
                                            </ErrorMessage>
                                        </Col>

                                        {/* ✅ Qualification */}
                                        <Col md={3}>
                                            <Select
                                                classNamePrefix="react-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                                value={qualifications
                                                    .map(q => ({ value: q.id, label: q.name }))
                                                    .find(opt => String(opt.value) === String(row.educationQualificationsId))}
                                                onChange={(selected) =>
                                                    updateRow(gIdx, rIdx, "educationQualificationsId", selected?.value || "")
                                                }
                                                options={qualifications
                                                    .filter(q => {
                                                        // Filter out qualifications already selected in other rows within the same group
                                                        const alreadySelected = group.educations
                                                            .some((row, index) => index !== rIdx && row.educationQualificationsId === q.id);
                                                        return !alreadySelected;
                                                    })
                                                    .map(q => ({
                                                        value: q.id,
                                                        label: q.name
                                                    }))}
                                                placeholder="Degree"
                                            />
                                            <ErrorMessage>
                                                {errors.rows?.[flatIndex]?.educationQualificationsId &&
                                                    t(errors.rows[flatIndex].educationQualificationsId)}
                                            </ErrorMessage>
                                        </Col>

                                        {/* ✅ Specialization */}
                                        <Col md={2}>
                                            <Select
                                                classNamePrefix="react-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                                value={getSpecializationsForDegree(row.educationQualificationsId)
                                                    .map(s => ({ value: s.id, label: s.label }))
                                                    .find(opt => String(opt.value) === String(row.specializationId))}
                                                onChange={(selected) =>
                                                    updateRow(gIdx, rIdx, "specializationId", selected?.value || "")
                                                }
                                                options={getSpecializationsForDegree(row.educationQualificationsId).map(s => ({
                                                    value: s.id,
                                                    label: s.label
                                                }))}
                                                placeholder="Specialization"
                                            />
                                        </Col>

                                        {/* ✅ Duration */}
                                        <Col md={2}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Duration (Years)"
                                                value={row.duration}
                                                min="0"
                                                step="1"

                                                onKeyDown={(e) => {
                                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}

                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                }}

                                                onChange={(e) =>
                                                    updateRow(gIdx, rIdx, "duration", e.target.value)
                                                }
                                            />
                                            <ErrorMessage>
                                                {errors.rows?.[flatIndex]?.duration &&
                                                    t(errors.rows[flatIndex].duration)}
                                            </ErrorMessage>
                                        </Col>

                                        {/* ✅ GPA */}
                                        <Col md={1}>
                                            <Form.Control
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="GPA"
                                                value={row.gpa}

                                                onChange={(e) => {
                                                    let value = e.target.value;

                                                    // allow only numbers and dot
                                                    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;

                                                    // limit to 2 decimal places
                                                    const parts = value.split(".");
                                                    if (parts[1]?.length > 2) return;

                                                    updateRow(gIdx, rIdx, "gpa", value);
                                                }}
                                            />
                                            <ErrorMessage>
                                                {errors.rows?.[flatIndex]?.gpa &&
                                                    t(errors.rows[flatIndex].gpa)}
                                            </ErrorMessage>
                                        </Col>

                                        {/* ✅ Percentage */}
                                        <Col md={1}>
                                            <Form.Control
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="%"
                                                value={row.percentage}

                                                onChange={(e) => {
                                                    let value = e.target.value;

                                                    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;

                                                    const parts = value.split(".");
                                                    if (parts[1]?.length > 2) return;

                                                    updateRow(gIdx, rIdx, "percentage", value);
                                                }}
                                            />
                                            <ErrorMessage>
                                                {errors.rows?.[flatIndex]?.percentage &&
                                                    t(errors.rows[flatIndex].percentage)}
                                            </ErrorMessage>
                                        </Col>

                                        {/* ✅ Delete */}
                                        <Col md={1}>
                                            {group.educations.length > 1 && (
                                                <Button onClick={() => removeRow(gIdx, rIdx)}>
                                                    X
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                );
                            })}
                            <Button
                                variant="none"
                                size="sm"
                                onClick={() => addRow(gIdx)}
                                className="mb-3 edu-btn"
                            >
                                + Add Education
                            </Button>
                        </div>
                        {gIdx < groups.length - 1 && (
                            <div className="or-divider">( OR )</div>
                        )}
                    </React.Fragment>
                ))}

<Button className="btn-header" variant="none" onClick={addGroup}>+ Add Group</Button>
                {errors.rows?._error && (
                    <div className="mt-2">
                        <ErrorMessage>{t(errors.rows._error)}</ErrorMessage>
                    </div>
                )}

                 {/* <Button variant="none" onClick={addRow} className="edu-btn">
                    {t("addPosition:add_degree")}
                </Button>  */}


                <Col md={6} className="mt-4">
                    <h6 className="f14 bluecol">{t("addPosition:certifications_optional")}</h6>

                    {certGroups.map((certGroup, cgIdx) => (
                        <React.Fragment key={cgIdx}>
                            <div className="group-box">
                                <div className="group-header">
                                    <strong>Certification Group {cgIdx + 1}</strong>
                                    {certGroups.length > 1 && (
                                        <Button
                                            onClick={() => removeCertGroup(cgIdx)}
                                            disabled={certGroups.length === 1}
                                            variant="none"
                                        >
                                            {/* Delete Group */}
                                            <img src={delete_icon} alt="delete_icon" className="icon-16" />
                                        </Button>
                                    )}
                                </div>

                                {(certGroup && Array.isArray(certGroup.certifications) ? certGroup.certifications : []).map((certRow, crIdx) => (
                                    <Row key={crIdx} className="mb-2 align-items-center">
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
                                                    ...filteredCertifications(certGroup, crIdx).map(c => ({
                                                        value: c.id,
                                                        label: c.name
                                                    }))
                                                ].find(option => String(option.value) === String(certRow.certificationId))}
                                                onChange={(selected) => {
                                                    updateCertRow(cgIdx, crIdx, "certificationId", selected ? selected.value : "");
                                                }}
                                                options={[
                                                    { value: "", label: t("common:select_certification") },
                                                    ...filteredCertifications(certGroup, crIdx).map(c => ({
                                                        value: c.id,
                                                        label: c.name
                                                    }))
                                                ]}
                                            />
                                        </Col>

                                        <Col md={1} className="text-center">
                                            {certGroup.certifications.length > 1 && (
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-danger"
                                                    onClick={() => removeCertRow(cgIdx, crIdx)}
                                                >
                                                    <img src={delete_icon} alt="delete_icon" className="icon-16" />
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="none"
                                    size="sm"
                                    onClick={() => addCertRow(cgIdx)}
                                    className="mb-3 edu-btn"
                                >
                                    + Add Certification
                                </Button>
                            </div>
                            {cgIdx < certGroups.length - 1 && (
                                <div className="or-divider">( OR )</div>
                            )}
                        </React.Fragment>
                    ))}
                </Col>

                <Button className="btn-header" variant="none" onClick={addCertGroup}>+ Add Certification Group</Button>



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
                        const allRows = groups.flatMap(g => g.educations);
                        const validationErrors = validateEducationModal({
  rows: allRows,
  mode,
});

                        if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                        }

                        const filledRows = groups.flatMap(g => g.educations).filter(
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

                       const cleanText = [
                        degreeText ? `Education Requirements:\n${degreeText}` : "",
                        `Certifications: ${certText || "None"}`
                        ]
                        .filter(Boolean)
                        .join("\n");

                    const payload = {
                            groups: groups.map(group => ({
                            educations: group.educations
                            .filter(r => r.educationTypeId && r.educationQualificationsId)
                            .map(r => ({
                                educationTypeId: r.educationTypeId,
                                educationQualificationsId: r.educationQualificationsId,
                                specializationId: r.specializationId || null,
                                duration: r.duration,
                                gpa: r.gpa,
                                percentage: r.percentage
                            }))
                        })),

                        certGroups: certGroups.map(certGroup => ({
                            certifications: (certGroup.certifications || [])
                            .filter(cr => cr.certificationId)
                            .map(cr => ({
                                certificationId: cr.certificationId
                            }))
                        })),

                        text: cleanText, // ✅ KEEP THIS
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
