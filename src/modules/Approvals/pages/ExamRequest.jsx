import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faLayerGroup,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useExamRequest from "../hooks/useExamRequest";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "../../../style/css/ExamRequest.css"

const ExamRequest = () => {
    const { t } = useTranslation(["jobPostingsList", "common"]);
    const privileges = useSelector((state) => state.user.privileges);

    const {
        requisitionOptions,
        positionOptions,
        loadingRequisitions,
        loadingPositions,
        fetchRequisitions,
        fetchPositions,
        setPositionOptions,
    } = useExamRequest();

    const [selectedRequisition, setSelectedRequisition] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const onRequisitionChange = async (req) => {
        setSelectedRequisition(req);
        setRequisitionPositions([]);

        if (!req?.id) return;

        const positions = await fetchPositions(req.id);
        setRequisitionPositions(positions || []);
    };
    const [requisitionPositions, setRequisitionPositions] = useState([]);
    const selectStyles = {
        control: (base) => ({
            ...base,
            height: "38px",
            minHeight: "38px",
            fontSize: "14px",
        }),
        valueContainer: (base) => ({
            ...base,
            height: "38px",
            padding: "0 8px",
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: "34px",
        }),
        input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
        }),
        singleValue: (base) => ({
            ...base,
            fontSize: "14px",
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: "14px",
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    useEffect(() => {
        fetchRequisitions();
    }, [fetchRequisitions]);

    const selectedRequisitionOption = selectedRequisition
        ? {
            label: `${selectedRequisition.requisitionCode} - ${selectedRequisition.requisitionTitle}`,
            value: selectedRequisition.id,
            raw: selectedRequisition,
        }
        : null;

    const selectedPositionOption = selectedPosition
        ? {
            label: selectedPosition.positionName,
            value: selectedPosition.positionId,
            raw: selectedPosition,
        }
        : null;

    const staticPositionRows = [
        {
            requisition: "BOB/HRM/REC/ADVT/2025/06",
            position: "Deputy Manager",
            totalMarks: 100,
            scst: "40%",
            obc: "50%",
            ur: "60%",
            writtenWeightage: "60%",
            status: "L1 Pending",
        },
        {
            requisition: "BOB/HRM/REC/ADVT/2025/08",
            position: "Director",
            totalMarks: 200,
            scst: "40%",
            obc: "50%",
            ur: "60%",
            writtenWeightage: "60%",
            status: "L2 Pending",
        },
        {
            requisition: "BOB/HRM/REC/ADVT/2025/10",
            position: "Auditor",
            totalMarks: 100,
            scst: "40%",
            obc: "50%",
            ur: "60%",
            writtenWeightage: "60%",
            status: "L1 Pending",
        },
        {
            requisition: "BOB/HRM/REC/ADVT/2025/07",
            position: "Sales Manager",
            totalMarks: 150,
            scst: "40%",
            obc: "50%",
            ur: "60%",
            writtenWeightage: "60%",
            status: "Approved",
        },
        {
            requisition: "BOB/HRM/REC/ADVT/2025/05",
            position: "Finance Officer",
            totalMarks: 100,
            scst: "40%",
            obc: "50%",
            ur: "60%",
            writtenWeightage: "60%",
            status: "Approved",
        },
    ];

    const getStatusBadge = (status) => {
        if (status === "Approved") return "success";
        if (status.includes("Pending")) return "warning";
        return "secondary";
    };

    return (
        <div className="exam-request">
            <Container fluid className="exam-page">
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h5 className="page-title">Written Exam — Section & Cutoff Configuration</h5>
                        <p className="page-subtitle">
                           Review and approve or reject Exam requests
                        </p>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-end filters-row border rounded p-3 bulk-actions">
                    <Col xs={12} md={4}>
                        <div className="field-label mb-2">Requisition</div>
                        <Select
                            placeholder="Select Requisition"
                            styles={selectStyles}
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            options={requisitionOptions}
                            isLoading={loadingRequisitions}
                            value={selectedRequisitionOption}
                            onChange={(opt) => {
                                onRequisitionChange(opt?.raw || null);
                            }}
                        />
                    </Col>



                </Row>

                {selectedRequisition && (
                    <Row className="mt-4">
                        <Col>
                            <div className="border rounded bg-white p-3">
                                <div className="section-header mb-3">
                                    Position Wise Cutoff Configuration
                                </div>

                                {loadingPositions ? (
                                    <div className="text-muted">Loading positions...</div>
                                ) : requisitionPositions.length === 0 ? (
                                    <div className="text-muted">No positions available for this requisition.</div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {requisitionPositions.map((pos) => (
                                            <div key={pos.value} className="position-item">
                                                <div className="position-item-header">
                                                    {pos.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                )}

                {/* <Row className="mt-4">
                    <Col>
                        <div className="border rounded bg-white p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0" style={{ color: "#3551a3" }}>
                                    Position Wise Cutoff Configuration
                                </h5>
                                <Button variant="outline-secondary">Filters</Button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered align-middle mb-0">
                                    <thead>
                                        <tr>


                                            <th rowSpan="2">Total Marks</th>
                                            <th colSpan="3" className="text-center">
                                                Category Wise Cut-off (%)
                                            </th>
                                            <th rowSpan="2">Written Exam Weightage</th>
                                            <th rowSpan="2">Status</th>

                                        </tr>
                                        <tr>
                                            <th>SC/ST</th>
                                            <th>OBC</th>
                                            <th>UR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staticPositionRows.map((row) => (
                                            <tr key={`${row.requisition}-${row.position}`}>

                                                <td>{row.totalMarks}</td>
                                                <td>{row.scst}</td>
                                                <td>{row.obc}</td>
                                                <td>{row.ur}</td>
                                                <td>{row.writtenWeightage}</td>
                                                <td>
                                                    <Badge bg={getStatusBadge(row.status)}>{row.status}</Badge>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </Col>
                </Row> */}
            </Container>
        </div>
    );
};

export default ExamRequest;