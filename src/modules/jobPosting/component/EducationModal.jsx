import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../../style/css/EducationModal.css";
import { validateEducationModal } from "../validations/validateEducationModal";
import ErrorMessage from "../../../shared/components/ErrorMessage";


const createRow = (isFirst = false) => ({
    operator: isFirst ? "" : "OR",
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
    const [errors, setErrors] = useState({});
    const [rows, setRows] = useState([createRow(true)]);
    const [certIds, setCertIds] = useState([""]);


    useEffect(() => {
        if (!show) return;

        if (initialData?.certificationIds?.length) {
            setCertIds(initialData.certificationIds);
        } else {
            // ✅ Always show ONE dropdown by default
            setCertIds([""]);
        }

        if (initialData?.rows?.length) {
            setRows(initialData.rows);
        } else {
            setRows([createRow(true)]);
        }
    }, [show, mode, initialData]);


    const getLabel = (list, id, key = "label") =>
        list.find(i => i.id === id)?.[key] || "";

    const degreeText = rows
        .filter(r =>
            r.educationTypeId &&
            r.educationQualificationsId &&
            r.specializationId
        )
        .map((r, i) => {
            const type = getLabel(educationTypes, r.educationTypeId);
            const degree = getLabel(qualifications, r.educationQualificationsId, "name");
            const spec = getLabel(specializations, r.specializationId);

            return `${i > 0 ? r.operator + " " : ""}${type} ${degree} in ${spec}`;
        })
        .join(" ");


    const addRow = () => {
        setRows([...rows, createRow(false)]);
    };

    const updateRow = (i, field, value) => {
        const copy = [...rows];
        copy[i][field] = value;
        setRows(copy);
    };
    const removeRow = (index) => {
        setRows(prev => {
            const updated = prev.filter((_, i) => i !== index);

            // ensure first row has no operator
            if (updated.length > 0) {
                updated[0] = { ...updated[0], operator: "" };
            }

            return updated.length ? updated : [createRow(true)];
        });
    };










    const certText = certIds
        .map(id => certifications.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(" OR ");


    const finalText = `Degree Requirements:
${degreeText || "Not specified"}
Certifications: ${certText || "None"}
            `.trim();

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="edu-modal">
            <Modal.Header closeButton className="edu-modal-header">
                <Modal.Title>
                    {mode === "mandatory"
                        ? "Add Mandatory Education"
                        : "Add Preferred Education"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {rows.map((row, idx) => (
                    <Row key={idx} className="mb-3 align-items-center">
                        <Col md={2} >
                            <Form.Select
                                disabled={idx === 0}
                                value={row.operator}
                                onChange={(e) => updateRow(idx, "operator", e.target.value)}
                            >
                                {idx === 0 && (
                                    <option value="">
                                        OR/AND
                                    </option>
                                )}
                                <option value="OR">OR</option>
                                <option value="AND">AND</option>
                            </Form.Select>
                            <ErrorMessage message={errors.rows?.[idx]?.operator} />
                        </Col>

                        <Col md={3} className="ps-0">
                            <Form.Select
                                value={row.educationTypeId}
                                onChange={(e) =>
                                    updateRow(idx, "educationTypeId", e.target.value)
                                }
                            >
                                <option value="">Select Type</option>
                                {educationTypes.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.label}
                                    </option>
                                ))}
                            </Form.Select>


                            <ErrorMessage>{errors.rows?.[idx]?.educationTypeId}</ErrorMessage>                        </Col>

                        <Col md={3} className="px-0">
                            <Form.Select
                                value={row.educationQualificationsId}
                                onChange={(e) =>
                                    updateRow(idx, "educationQualificationsId", e.target.value)
                                }
                            >
                                <option value="">Select Degree</option>
                                {qualifications.map(q => (
                                    <option key={q.id} value={q.id}>
                                        {q.name}
                                    </option>
                                ))}
                            </Form.Select>


                            <ErrorMessage>{errors.rows?.[idx]?.educationQualificationsId}</ErrorMessage>                        </Col>

                        <Col md={3}>
                            <Form.Select
                                value={row.specializationId}
                                onChange={(e) =>
                                    updateRow(idx, "specializationId", e.target.value)
                                }
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}
                                    </option>
                                ))}
                            </Form.Select>


                            <ErrorMessage>{errors.rows?.[idx]?.specializationId}</ErrorMessage>                        </Col>
                        <Col md={1} className="px-1">
                            {rows.length > 1 && (
                                <Button
                                    variant="link"
                                    className="p-0 text-danger"
                                    onClick={() => removeRow(idx)}
                                    title="Remove"
                                >
                                    🗑️
                                </Button>
                            )}
                        </Col>
                    </Row>
                ))}

                <Button variant="none" onClick={addRow} className="edu-btn">
                    + Add Degree
                </Button>


                <Col md={6} className="mt-4">
                    <h6>Certifications (Optional)</h6>

                    {certIds.map((id, i) => (
                        <Row key={i} className="mb-2 align-items-center">
                            <Col md={10}>
                                <Form.Select
                                    value={id}
                                    onChange={e => {
                                        const copy = [...certIds];
                                        copy[i] = e.target.value;
                                        setCertIds(copy);
                                    }}
                                >
                                    <option value="">Select Certification</option>
                                    {certifications.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2} className="text-center">
                                {certIds.length > 1 && (
                                    <Button
                                        variant="link"
                                        className="p-0 text-danger"
                                        onClick={() =>
                                            setCertIds(prev => prev.filter((_, x) => x !== i))
                                        }
                                    >
                                        🗑️
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}
                </Col>

                <Button variant="none" onClick={() => setCertIds([...certIds, ""])}>
                    + Add Certification
                </Button>



                <div className="mt-4 p-3 bg-light border rounded">
                    <strong>Result (How it will look for candidate)</strong>
                    <pre className="mt-2 mb-0">{finalText}</pre>
                </div>
            </Modal.Body>

            <Modal.Footer className="edu-modal-footer">
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        const validationErrors = validateEducationModal({
                            rows,
                            certificationIds: certIds.filter(Boolean),
                        });

                        if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                        }

                        setErrors({});

                        onSave({
                            educations: rows.map(r => ({
                                educationTypeId: r.educationTypeId,
                                educationQualificationsId: r.educationQualificationsId,
                                specializationId: r.specializationId,
                            })),
                            certificationIds: certIds.filter(Boolean), // ✅ UUIDs only
                            text: finalText,
                        });

                        onHide();
                    }}
                >
                    Save
                </Button>



            </Modal.Footer>
        </Modal>
    );
}
