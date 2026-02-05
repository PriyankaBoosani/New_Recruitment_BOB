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
    ChevronDown,
    ChevronUp
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import "../../../style/css/JobPostingsList.css";
import DeleteConfirmationModal from "../component/DeleteConfirmationModal";
import ConfirmationModal from "../component/ConfirmationModal"

import start_icon from "../../../assets/start_icon.png";
import dept_icon from "../../../assets/dept_icon.png"
import end_icon from "../../../assets/end_icon.png"
import submitIcon from "../../../assets/submitIcon.png";
import pos_edit_icon from "../../../assets/pos_edit_icon.png";
import pos_delete_icon from "../../../assets/pos_delete_icon.png";
import pos_plus_icon from "../../../assets/pos_plus_icon.png";
import mingcute_department_line from "../../../assets/mingcute_department-line.png";
import vacancy_icon from "../../../assets/vacancy_icon.png";
import position_Icon from "../../../assets/position_Icon.png";
import view_jobpost from "../../../assets/view_jobpost.png"
import { useJobRequisitions } from "../hooks/useJobAllRequisition";
import { useJobPositionsByRequisition } from "../hooks/useJobPositionsByRequisition";
import { toast } from "react-toastify";
import { validateRequisitionSubmission } from "../validations/validateRequisitionSubmission";
import CreatePlus_Icon from "../../../assets/CreatePlus_Icon.png";
const JobPostingsList = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [pageSize, setPageSize] = useState(10);

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
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(0); // backend is 0-based
    const [showSubmitModal, setShowSubmitModal] = useState(false);
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
    const { requisitions, loading, pageInfo, deleteRequisition, submitForApproval, refetch } = useJobRequisitions({
        year,
        status,
        search,
        page,
        size: pageSize
    });

    useEffect(() => {
        setPage(0);
    }, [pageSize]);


    const [selectedReqIds, setSelectedReqIds] = useState(new Set());
    const selectableRequisitions = requisitions.filter(
        r => r.status !== "Approved" && !r.hasDraftPositions
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(0); // reset pagination on new search
        }, 500); // ⏱️ 400–600ms is ideal

        return () => clearTimeout(timeout);
    }, [searchInput]);

    const allSelected =
        selectableRequisitions.length > 0 &&
        selectableRequisitions.every(r => selectedReqIds.has(r.id));


    const handleCancelSelection = () => {
        setSelectedReqIds(new Set());
    };
    const handleSubmitForApproval = () => {
        // ONLY requisitions currently rendered (current year / filters)
        const visibleRequisitions = requisitions;

        const selectedVisibleRequisitions = visibleRequisitions.filter(r =>
            selectedReqIds.has(r.id)
        );

        if (selectedVisibleRequisitions.length === 0) {
            toast.error("No requisitions selected for the current year.");
            return;
        }

        const errors = validateRequisitionSubmission({
            requisitions,
            selectedReqIds,
        });

        if (errors.length > 0) {
            errors.forEach(e => toast.error(e));
            return;
        }


        const ids = selectedVisibleRequisitions
            .filter(r => r.status !== "Approved")
            .map(r => r.id);

        if (ids.length === 0) return;

        submitForApproval(ids);
        setSelectedReqIds(new Set());
    };


    useEffect(() => {
        setSelectedReqIds(new Set());
    }, [year]);

    const formatDateDDMMYYYY = (isoDate) => {
        if (!isoDate) return "";

        const [year, month, day] = isoDate.split("-");
        return `${day}-${month}-${year}`;
    };



    return (
        <Container fluid className="job-postings-page">
            {/* ================= HEADER ================= */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5 className="page-title">All Requisitions</h5>
                </Col>
                <Col className="text-end create">
                    <Button onClick={() => navigate("/job-posting/create-requisition")}>
                        <img src={CreatePlus_Icon} alt="Create New Requisition" className="icon-16" /> Create New Requisition
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
                            placeholder="Search requisitions by id,title,department..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </Col>

                <Col xs={12} md={1}>
                    <Form.Select
                        className="status-select"
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="NEW">New</option>
                        <option value="APPROVED">Approved</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* ================= BULK ACTIONS ================= */}
            <Row className="bulk-actions align-items-center mb-3">
                <Col xs={12} md={6} className="selectcheck">
                    <Form.Check
                        type="checkbox"
                        id="select-all-requisitions"
                        className="selectall d-flex align-items-center"
                        label="Select All"
                        checked={allSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedReqIds(
                                    new Set(selectableRequisitions.map(r => r.id))
                                );
                            } else {
                                setSelectedReqIds(new Set());
                            }
                        }}
                    />
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                    <Button
                        variant="primary"
                        className="me-2 subbtn"
                        disabled={selectedReqIds.size === 0 || loading}
                        onClick={() => setShowSubmitModal(true)}

                    >
                        <img src={submitIcon} alt="submit" className="icon-16" /> Submit
                    </Button>


                    <Button
                        variant="outline-secondary"
                        className="canbtn"
                        onClick={handleCancelSelection}
                        disabled={selectedReqIds.size === 0 || loading}
                    >
                        Cancel
                    </Button>

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
                            <Col xs={12} md={6}>
                                <div className="req-header">
                                    <Badge bg="light" text="primary" className="req-id">
                                        {req.requisitionId}
                                    </Badge>
                                    <Badge bg={req.statusType} className="ms-2 capitalize-status">
                                        {req.status}
                                    </Badge>

                                </div>

                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex align-items-start">
                                        <Form.Check
                                            type="checkbox"
                                            className="me-2 mt-2"
                                            checked={selectedReqIds.has(req.id)}
                                            disabled={req.status === "Approved" || req.hasDraftPositions}

                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                if (req.status === "Approved") return;

                                                setSelectedReqIds(prev => {
                                                    const next = new Set(prev);
                                                    if (e.target.checked) {
                                                        next.add(req.id);
                                                    } else {
                                                        next.delete(req.id);
                                                    }
                                                    return next;
                                                });
                                            }}
                                        />

                                        <div>
                                            <h6 className="req-code mb-2">{req.code}</h6>
                                            <div className="req-dates">
                                                <div>
                                                    <img src={start_icon} alt="start_icon" className="icon-12" />{" "}Start: {formatDateDDMMYYYY(req.startDate)}
                                                </div>
                                                <div><img src={end_icon} alt="end_icon" className="icon-12" /> End: {formatDateDDMMYYYY(req.endDate)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div className="req-meta">
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

                            </Col>

                            {/* -------- ACTIONS -------- */}
                            <Col
                                xs={12}
                                md={2}
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
                                        <img src={view_jobpost} alt="view" className="icon-19" />
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
                                                    src={dept_icon}
                                                    className="icon-22"
                                                    alt="dept_icon"
                                                />
                                                <span className="depname">{dept.departmentName}</span>
                                                <Badge bg="light" text="primary" className="deppos">
                                                    {dept.positions.length}{" "}
                                                    {dept.positions.length === 1 ? "Position" : "Positions"}
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

                                                        {req.editable ? (
                                                            <>
                                                                {/* EDIT POSITION */}
                                                                <Button
                                                                    variant="light"
                                                                    className="icon-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(
                                                                            `/job-posting/${req.id}/add-position?positionId=${pos.positionId}`,
                                                                            { state: { mode: "edit" } }
                                                                        );

                                                                    }}
                                                                >
                                                                    <img src={pos_edit_icon} className="icon-16" alt="edit" />
                                                                </Button>

                                                                {/* DELETE POSITION */}
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
                                                            </>
                                                        ) : (
                                                            /* VIEW POSITION */
                                                            <Button
                                                                variant="light"
                                                                className="icon-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(
                                                                        `/job-posting/${req.id}/add-position?positionId=${pos.positionId}`,
                                                                        { state: { mode: "view" } }
                                                                    );

                                                                }}
                                                            >
                                                                <img src={view_jobpost} className="icon-19" alt="view" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="position-details">
                                                        <div>
                                                            Mandatory Education:{" "}
                                                            {pos.mandatoryEducation}
                                                        </div>
                                                        <div>
                                                            Preferred Education:{" "}
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
            {pageInfo && (
                <Row className="mt-4 mb-4">
                    <Col className="d-flex justify-content-end align-items-center gap-3">

                        {/* Page size */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold pagesize">Page size:</span>
                            <Form.Select
                                size="sm"
                                style={{ width: "90px" }}
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(0); // 🔑 mandatory
                                }}
                            >
                                {[5, 10, 15, 20, 25, 30].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </Form.Select>
                        </div>

                        {/* Pagination */}
                        {pageInfo.totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${page === 0 || loading ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(p => Math.max(p - 1, 0))}
                                            disabled={page === 0 || loading}
                                        >
                                            &laquo;
                                        </button>
                                    </li>

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

                                    <li className={`page-item ${page >= pageInfo.totalPages - 1 || loading ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page >= pageInfo.totalPages - 1 || loading}
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
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
                onConfirm={handleConfirmDeletePosition} title="Delete Position" message="Are you sure you want to delete this position?" itemLabel={selectedPosition?.positionName}
            />
            <ConfirmationModal
                show={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={() => {
                    setShowSubmitModal(false);
                    handleSubmitForApproval();
                }}
                title="Direct Approval Confirmation"
                message="This action will directly approve the selected requisition(s). Are you sure you want to continue?"
                itemLabel={`${selectedReqIds.size} requisition(s)`}
                confirmText="Approve"
                confirmVariant="primary"
            />




        </Container >
    );
};

export default JobPostingsList;
