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
  duration: "",
  gpa: "",
  percentage: ""
});

const createGroup = () => ({
  rows: [createRow()]
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
    const groupText = group.rows
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
  copy[groupIndex].rows.push(createRow());
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
  copy[gIdx].rows[rIdx][field] = value;
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

  if (copy[gIdx].rows.length === 1) {
    // reset instead of delete
    copy[gIdx].rows[0] = createRow();
  } else {
    copy[gIdx].rows.splice(rIdx, 1);
  }

  setGroups(copy);
};
const removeGroup = (gIdx) => {
  if (groups.length === 1) return;

  setGroups(groups.filter((_, i) => i !== gIdx));
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

    const filteredCertifications = certifications
        .filter(c => c.name?.toLowerCase() !== "other")
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

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
  <div key={gIdx} className="group-box">

    <div className="group-header">
      <strong>Group {gIdx + 1} (AND)</strong>

      {groups.length > 1 && (
        <Button
  onClick={() => removeGroup(gIdx)}
  disabled={groups.length === 1}
  variant="outline-danger"
>
  Delete Group
</Button>
      )}
    </div>

    {group.rows.map((row, rIdx) => {

  // ✅ ADD THIS (VERY IMPORTANT)
  const flatIndex =
    groups.slice(0, gIdx).reduce((acc, g) => acc + g.rows.length, 0) + rIdx;

  return (
    <Row key={rIdx} className="mb-3 align-items-center">

      {/* ✅ Education Type */}
      <Col md={2}>
        <Select
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
      <Col md={2}>
        <Select
          value={qualifications
            .map(q => ({ value: q.id, label: q.name }))
            .find(opt => String(opt.value) === String(row.educationQualificationsId))}
          onChange={(selected) =>
            updateRow(gIdx, rIdx, "educationQualificationsId", selected?.value || "")
          }
          options={qualifications.map(q => ({
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
          placeholder="Duration"
          value={row.duration}
          min="0"
          step="1"
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
      <Col md={2}>
        <Form.Control
          type="number"
          placeholder="GPA"
          value={row.gpa}
          min="0"
          max="10"
          step="0.01"
          onChange={(e) =>
            updateRow(gIdx, rIdx, "gpa", e.target.value)
          }
        />
        <ErrorMessage>
          {errors.rows?.[flatIndex]?.gpa &&
            t(errors.rows[flatIndex].gpa)}
        </ErrorMessage>
      </Col>

      {/* ✅ Percentage */}
      <Col md={1}>
        <Form.Control
          type="number"
          placeholder="%"
          value={row.percentage}
          min="0"
          max="100"
          step="0.01"
          onChange={(e) =>
            updateRow(gIdx, rIdx, "percentage", e.target.value)
          }
        />
        <ErrorMessage>
          {errors.rows?.[flatIndex]?.percentage &&
            t(errors.rows[flatIndex].percentage)}
        </ErrorMessage>
      </Col>

      {/* ✅ Delete */}
      <Col md={1}>
        {group.rows.length > 1 && (
          <Button onClick={() => removeRow(gIdx, rIdx)}>
            X
          </Button>
        )}
      </Col>

    </Row>
  );
})}
{/* 
    {gIdx < groups.length - 1 && (
      <div className="or-divider">OR</div>
    )} */}
    <Button
  variant="outline-primary"
  size="sm"
  onClick={() => addRow(gIdx)}
  className="mb-3"
>
  + Add Education
</Button>

  </div>
))}

<Button onClick={addGroup}>+ Add Group</Button>
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
                                        ...filteredCertifications.map(c => ({
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
                                        ...filteredCertifications.map(c => ({
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
                        const allRows = groups.flatMap(g => g.rows);
                        const validationErrors = validateEducationModal({
  rows: allRows,
  mode,
});

                        if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                        }

                        const filledRows = groups.flatMap(g => g.rows).filter(
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
                            educations: group.rows
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

                        certificationIds: certIds.filter(Boolean),

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
