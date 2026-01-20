// src/modules/jobPostings/pages/JobPostingsList.jsx

import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Badge,
    Spinner
} from "react-bootstrap";
import {
    Plus,
    Search,
    Eye,
    ChevronDown,
    ChevronUp
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import "../../../style/css/JobPostingsList.css";
import DeleteConfirmationModal from "../component/DeleteConfirmationModal";

import view_icon from "../../../assets/view_icon.png";
import submitIcon from "../../../assets/submitIcon.png";
import pos_edit_icon from "../../../assets/pos_edit_icon.png";
import pos_delete_icon from "../../../assets/pos_delete_icon.png";
import pos_plus_icon from "../../../assets/pos_plus_icon.png";
import mingcute_department_line from "../../../assets/mingcute_department-line.png";
import vacancy_icon from "../../../assets/vacancy_icon.png";
import position_Icon from "../../../assets/position_Icon.png";

import { useJobRequisitions } from "../hooks/useJobAllRequisition";
import { useJobPositionsByRequisition } from "../hooks/useJobPositionsByRequisition";

const JobPostingsList = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);

    const [showDeletePosModal, setShowDeletePosModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleConfirmDelete = async () => {
        if (!selectedReq) return;

        await deleteRequisition(selectedReq.id);
        setShowDeleteModal(false);
        setSelectedReq(null);
    };
    const handleConfirmDeletePosition = async () => {
        if (!selectedPosition) return;

        await deletePosition(
            selectedPosition.requisitionId,
            selectedPosition.positionId
        );
        fetchPositions(selectedPosition.requisitionId);
        refetch();
        setShowDeletePosModal(false);
        setSelectedPosition(null);
    };



    // 🔹 Backend-driven filters
    const [year, setYear] = useState("2026");
    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0); // backend is 0-based

    const {
        positionsByReq,
        loadingReqId,
        fetchPositions,
        deletePosition
    } = useJobPositionsByRequisition();


    // 🔹 Accordion
    const [openReqId, setOpenReqId] = useState(null);
    const toggleAccordion = (reqId) => {
        setOpenReqId((prev) => {
            const next = prev === reqId ? null : reqId;

            if (next) {
                fetchPositions(reqId);
            }

            return next;
        });
    };


    // 🔹 API Hook
    const { requisitions, loading, pageInfo, deleteRequisition, refetch } = useJobRequisitions({
        year,
        status,
        search,
        page,
        size: 10
    });

    useEffect(() => {
        setPage(0);
    }, [year, status, search]);




    return (
        <Container fluid className="job-postings-page">
            {/* ================= HEADER ================= */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5 className="page-title">All Requisitions</h5>
                </Col>
                <Col className="text-end create">
                    <Button onClick={() => navigate("/job-posting/create-requisition")}>
                        <Plus /> Create New Requisition
                    </Button>
                </Col>
            </Row>

            {/* ================= FILTERS ================= */}
            <Row className="filters-row g-2 mb-3">
                <Col xs={12} md={2}>
                    <Form.Select
                        className="yearfon"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="2026">Year - 2026</option>
                        <option value="2025">Year - 2025</option>
                        <option value="2024">Year - 2024</option>
                    </Form.Select>
                </Col>

                <Col xs={12} md={9}>
                    <div className="search-boxpost">
                        <Search />
                        <Form.Control
                            type="text"
                            placeholder="Search requisitions by code or title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </Col>

                <Col xs={12} md={1}>
                    <Form.Select
                        className="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="New">New</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* ================= BULK ACTIONS ================= */}
            <Row className="bulk-actions align-items-center mb-3">
                <Col xs={12} md={6}>
                    <Form.Check type="checkbox" label="Select All" className="selectall" />
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                    <Button variant="primary" className="me-2 subbtn">
                        <img src={submitIcon} alt="submit" className="icon-16" /> Submit
                    </Button>
                    <Button variant="outline-secondary canbtn">Cancel</Button>
                </Col>
            </Row>

            {/* ================= LOADER ================= */}
            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            )}

            {/* ================= LIST ================= */}
            {!loading && requisitions.length === 0 && (
                <div className="text-center text-muted my-4">
                    No requisitions found
                </div>
            )}

            {requisitions.map((req) => {

                const positions = positionsByReq[req.id] || [];

                const positionsGroupedByDept = positions.reduce((acc, pos) => {
                    if (!acc[pos.deptId]) {
                        acc[pos.deptId] = {
                            departmentName: pos.departmentName,
                            positions: []
                        };
                    }
                    acc[pos.deptId].positions.push(pos);
                    return acc;
                }, {});

                return (
                    <div key={req.id} className="requisition-card mb-3">
                        <Row
                            className="align-items-center req-clickable"
                            onClick={() => toggleAccordion(req.id)}
                        >
                            {/* -------- LEFT -------- */}
                            <Col xs={12} md={8}>
                                <div className="req-header">
                                    <Badge bg="light" text="primary" className="req-id">
                                        {req.requisitionId}
                                    </Badge>
                                    <Badge bg={req.statusType} className="ms-2">
                                        {req.status}
                                    </Badge>
                                </div>

                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex align-items-start">
                                        <Form.Check type="checkbox" className="me-2 mt-2" />
                                        <div>
                                            <h6 className="req-code mb-2">{req.code}</h6>
                                            <div className="req-dates">
                                                <div>Start: {req.startDate}</div> |
                                                <div>End: {req.endDate}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="req-meta text-end">
                                        <div>
                                            <img src={mingcute_department_line} alt="department" className="icon-16" />{" "}
                                            Department - {req.departments}
                                        </div>
                                        <div>
                                            <img src={position_Icon} alt="position" className="icon-16" /> Positions - {req.positions}
                                        </div>
                                        <div>
                                            <img src={vacancy_icon} alt="vacancy" className="icon-23" /> Vacancies -{" "}
                                            {req.vacancies}
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* -------- ACTIONS -------- */}
                            <Col
                                xs={12}
                                md={4}
                                className="text-md-end mt-3 mt-md-0 actions d-flex justify-content-end align-items-center gap-2"
                            >
                                {req.editable ? (
                                    <>
                                        <Button
                                            variant="light"
                                            className="icon-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/job-posting/${req.id}/add-position`);
                                            }}
                                        >
                                            <img src={pos_plus_icon} alt="add" className="icon-16" />
                                        </Button>

                                        <Button
                                            variant="light"
                                            className="icon-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    `/job-posting/create-requisition?id=${req.id}`,
                                                    { state: { mode: "edit" } }
                                                );
                                            }}
                                        >
                                            <img src={pos_edit_icon} alt="edit" className="icon-20" />
                                        </Button>

                                        <Button
                                            variant="light"
                                            className="icon-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedReq(req);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <img src={pos_delete_icon} alt="delete" className="icon-20" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="light"
                                        className="icon-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(
                                                `/job-posting/create-requisition?id=${req.id}`,
                                                { state: { mode: "view" } }
                                            );
                                        }}
                                    >
                                        <img src={view_icon} alt="view" className="icon-16" />
                                    </Button>
                                )}


                                <Button
                                    variant="none"
                                    className="accordion-arrow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAccordion(req.id);
                                    }}
                                >
                                    {openReqId === req.id ? <ChevronUp /> : <ChevronDown />}
                                </Button>
                            </Col>

                            {/* -------- ACCORDION BODY (STATIC FOR NOW) -------- */}
                            {openReqId === req.id && (
                                <div className="accordion-body mt-3">

                                    {loadingReqId === req.id && (
                                        <Spinner animation="border" size="sm" />
                                    )}

                                    {!loadingReqId && positions.length === 0 && (
                                        <div className="text-muted">No positions added</div>
                                    )}

                                    {Object.values(positionsGroupedByDept).map((dept) => (
                                        <div key={dept.departmentName} className="department-card mb-3">

                                            {/* 🔹 Department Header */}
                                            <div className="department-header d-flex align-items-center gap-2 my-2">
                                                <img
                                                    src={mingcute_department_line}
                                                    className="icon-16"
                                                    alt="department"
                                                />
                                                <strong>{dept.departmentName}</strong>
                                                <Badge bg="light" text="primary">
                                                    {dept.positions.length} Positions
                                                </Badge>
                                            </div>

                                            {/* 🔹 SAME position UI you already had */}
                                            {dept.positions.map((pos) => (
                                                <div key={pos.positionId} className="position-card-inner mb-2">
                                                    <div className="position-header-row">
                                                        <div className="position-title">
                                                            {pos.positionName}
                                                        </div>

                                                        <div className="position-meta-inline">
                                                            <span>Vacancies: {pos.vacancies}</span>
                                                            <span>
                                                                Age: {pos.minAge} – {pos.maxAge} Years
                                                            </span>
                                                        </div>

                                                        <Button
                                                            variant="light"
                                                            className="icon-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(
                                                                    `/job-posting/${req.id}/add-position?positionId=${pos.positionId}&mode=edit`
                                                                );
                                                            }}
                                                        >
                                                            <img src={pos_edit_icon} className="icon-16" alt="edit" />
                                                        </Button>

                                                        <Button
                                                            variant="light"
                                                            className="icon-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedPosition({
                                                                    requisitionId: req.id,
                                                                    positionId: pos.positionId,
                                                                    positionName: pos.positionName
                                                                });
                                                                setShowDeletePosModal(true);
                                                            }}
                                                        >
                                                            <img src={pos_delete_icon} className="icon-16" alt="delete" />
                                                        </Button>


                                                    </div>

                                                    <div className="position-details">
                                                        <div>
                                                            <strong>Mandatory Education:</strong>{" "}
                                                            {pos.mandatoryEducation}
                                                        </div>
                                                        <div>
                                                            <strong>Preferred Education:</strong>{" "}
                                                            {pos.preferredEducation}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ))}
                                </div>
                            )}

                        </Row>
                    </div>
                );
            })}
            {/* ================= PAGINATION ================= */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <Row className="mt-4 mb-4">
                    <Col className="d-flex justify-content-end">
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0">
                                {/* Previous Button */}
                                <li className={`page-item ${page === 0 || loading ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                        disabled={page === 0 || loading}
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>

                                {/* Page Numbers */}
                                {Array.from({ length: pageInfo.totalPages }).map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${page === index ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(index)}
                                            disabled={loading}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                {/* Next Button */}
                                <li className={`page-item ${page >= pageInfo.totalPages - 1 || loading ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={page >= pageInfo.totalPages - 1 || loading}
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            )}
            {/* Requisition Delete */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedReq(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Requisition"
                message="Are you sure you want to delete this requisition?"
                itemLabel={selectedReq?.code}
            />

            {/* Position Delete */}
            <DeleteConfirmationModal
                show={showDeletePosModal}
                onClose={() => {
                    setShowDeletePosModal(false);
                    setSelectedPosition(null);
                }}
                onConfirm={handleConfirmDeletePosition}
                title="Delete Position"
                message="Are you sure you want to delete this position?"
                itemLabel={selectedPosition?.positionName}
            />



        </Container>
    );
};

export default JobPostingsList;
