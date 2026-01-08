import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../../style/css/EducationModal.css";
import { validateEducationModal } from "../validations/validateEducationModal";
import ErrorMessage from "../../../shared/components/ErrorMessage";

const DEGREE_TYPES = ["Full Time", "Part Time"];
const DEGREES = ["BTech", "MCA", "MSc"];
const SPECIALIZATIONS = ["Computer Science", "ECE", "IT"];


const createRow = (isFirst = false) => ({
    operator: isFirst ? "" : "OR",
    type: "Full Time",
    degree: "",
    specialization: ""
});


export default function EducationModal({ show, mode, initialData, onHide, onSave }) {
    const [errors, setErrors] = useState({});
    const [rows, setRows] = useState([createRow(true)]);
    const [certs, setCerts] = useState([""]);

    useEffect(() => {
        if (!show) return;

        if (initialData?.rows?.length) {
            setRows(initialData.rows);
            setCerts(initialData.certs || []);
        } else {
            setRows([createRow(true)]);
            setCerts([""]);
        }
    }, [show, mode, initialData]);



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
    const removeCert = (index) => {
        setCerts(prev => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.length ? updated : [""];
        });
    };


    const updateCert = (i, value) => {
        const copy = [...certs];
        copy[i] = value;
        setCerts(copy);
    };

    const addCert = () => setCerts([...certs, ""]);

    const degreeText = rows
        .filter(r => r.degree && r.specialization)
        .map((r, i) =>
            `${i > 0 ? r.operator + " " : ""}${r.type} ${r.degree} in ${r.specialization}`
        )
        .join(" ");

    const certText = certs.filter(Boolean).join(" OR ");

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
                                value={row.type}
                                onChange={(e) =>
                                    updateRow(idx, "type", e.target.value)
                                }
                            >
                                {DEGREE_TYPES.map(t => (
                                    <option key={t}>{t}</option>
                                ))}
                            </Form.Select>
                            <ErrorMessage>{errors.rows?.[idx]?.type}</ErrorMessage>
                        </Col>

                        <Col md={3} className="px-0">
                            <Form.Select
                                value={row.degree}
                                onChange={(e) =>
                                    updateRow(idx, "degree", e.target.value)
                                }
                            >
                                <option value="">Select Degree</option>
                                {DEGREES.map(d => (
                                    <option key={d}>{d}</option>
                                ))}
                            </Form.Select>
                            <ErrorMessage>{errors.rows?.[idx]?.degree}</ErrorMessage>
                        </Col>

                        <Col md={3}>
                            <Form.Select
                                value={row.specialization}
                                onChange={(e) =>
                                    updateRow(idx, "specialization", e.target.value)
                                }
                            >
                                <option value="">Select Specialization</option>
                                {SPECIALIZATIONS.map(s => (
                                    <option key={s}>{s}</option>
                                ))}
                            </Form.Select>
                            <ErrorMessage>{errors.rows?.[idx]?.specialization}</ErrorMessage>
                        </Col>
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

                    {certs.map((c, i) => (
                        <Row key={i} className="mb-2 align-items-center">
                            <Col md={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter certification (e.g. CISSP, CISM)"
                                    value={c}
                                    onChange={(e) => updateCert(i, e.target.value)}
                                />
                            </Col>

                            <Col md={2} className="text-center">
                                {certs.length > 1 && (
                                    <Button
                                        variant="link"
                                        className="p-0 text-danger"
                                        onClick={() => removeCert(i)}
                                        title="Remove"
                                    >
                                        🗑️
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}



                </Col>

                <Button variant="none" onClick={addCert} className="edu-btn">
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
                        const validationErrors = validateEducationModal({ rows, certs });

                        if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                        }

                        setErrors({});
                        onSave({ rows, certs, text: finalText });
                        onHide();
                    }}
                >
                    Save
                </Button>


            </Modal.Footer>
        </Modal>
    );
}
