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
import { useTranslation } from "react-i18next";

const JobPostingsList = () => {
    const { t } = useTranslation(["jobPostingsList", "common"]);

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
    const [status, setStatus] = useState(null);
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
            toast.error(t("jobPostingsList:no_selected"));
            return;
        }

        const errors = validateRequisitionSubmission({
            requisitions,
            selectedReqIds,
        });

        // if (errors.length > 0) {
        //     errors.forEach(e => toast.error(e));
        //     return;
        // }

        if (errors.length > 0) {
            errors.forEach(e => {
                if (typeof e === "string") {
                    toast.error(t(e));
                } else {
                    toast.error(t(e.key, e.params));
                }
            });
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
    const getVisiblePages = (currentPage, totalPages) => {
        const windowSize = 3;

        let start = currentPage - 1;
        let end = currentPage + 2;

        // Clamp start & end
        if (start < 0) {
            start = 0;
            end = windowSize;
        }

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(0, end - windowSize);
        }

        const pages = [];
        for (let i = start; i < end; i++) {
            pages.push(i);
        }

        return {
            pages,
            showStartEllipsis: start > 0,
            showEndEllipsis: end < totalPages,
        };
    };



    return (
        <Container fluid className="job-postings-page">
            {/* ================= HEADER ================= */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5 className="page-title">{t("jobPostingsList:page_title")}</h5>
                </Col>
                <Col className="text-end create">
                    <Button onClick={() => navigate("/job-posting/create-requisition")}>
                        <img src={CreatePlus_Icon} alt="Create New Requisition" className="icon-16" /> {t("jobPostingsList:create_new_requisition")}
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
                        <option value="2026">{t("jobPostingsList:year_label")} - 2026</option>
                        <option value="2025">{t("jobPostingsList:year_label")} - 2025</option>
                        <option value="2024">{t("jobPostingsList:year_label")} - 2024</option>
                    </Form.Select>
                </Col>

                <Col xs={12} md={9}>
                    <div className="search-boxpost">
                        <Search />
                        <Form.Control
                            type="text"
                            placeholder={t("jobPostingsList:search_placeholder")}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </Col>

                <Col xs={12} md={1}>
                    <Form.Select
                        className="status-select"
                        value={status}
                        onChange={(e) => {
                            const value = e.target.value || null;
                            setStatus(value);
                            setPage(0);
                        }}
                    >
                        <option value="">{t("jobPostingsList:status_all")}</option>
                        <option value="NEW">{t("jobPostingsList:status_new")}</option>
                        <option value="APPROVED">{t("jobPostingsList:status_approved")}</option>
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
                        label={t("jobPostingsList:select_all")}
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
                        <img src={submitIcon} alt="submit" className="icon-16" /> {t("jobPostingsList:submit")}
                    </Button>


                    <Button
                        variant="outline-secondary"
                        className="canbtn"
                        onClick={handleCancelSelection}
                        disabled={selectedReqIds.size === 0 || loading}
                    >
                        {t("common:cancel")}
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
                    {t("jobPostingsList:no_requisitions")}
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
                                                    <img src={start_icon} alt="start_icon" className="icon-12" />{" "}{t("jobPostingsList:start_date")}: {formatDateDDMMYYYY(req.startDate)}
                                                </div>
                                                <div><img src={end_icon} alt="end_icon" className="icon-12" /> {t("jobPostingsList:end_date")}: {formatDateDDMMYYYY(req.endDate)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div className="req-meta">
                                    <div>
                                        <img src={mingcute_department_line} alt="department" className="icon-16" />{" "}
                                        {t("jobPostingsList:department")} - {req.departments}
                                    </div>
                                    <div>
                                        <img src={position_Icon} alt="position" className="icon-16" /> {t("jobPostingsList:positions")} - {req.positions}
                                    </div>
                                    <div>
                                        <img src={vacancy_icon} alt="vacancy" className="icon-23" /> {t("jobPostingsList:vacancies")} -{" "}
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
                                        <div className="text-muted">{t("jobPostingsList:no_positions")}</div>
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
                                                    {dept.positions.length === 1
                                                        ? t("jobPostingsList:position")
                                                        : t("jobPostingsList:positions_plural")}
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
                                                            <span>
                                                                {t("jobPostingsList:vacancies")}: {pos.vacancies}
                                                            </span>

                                                            <span>
                                                                {t("jobPostingsList:age")}: {pos.minAge} – {pos.maxAge} {t("jobPostingsList:years")}
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
                                                            {t("jobPostingsList:mandatory_education")}:{" "}
                                                            {pos.mandatoryEducation}
                                                        </div>
                                                        <div>
                                                            {t("jobPostingsList:preferred_education")}:{" "}
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
            {/* ================= PAGINATION ================= */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <Row className="mt-4 mb-4">
                    <Col className="d-flex justify-content-end align-items-center gap-3">

                        {/* Page size */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold pagesize">
                                {t("jobPostingsList:page_size")}:
                            </span>
                            <Form.Select
                                size="sm"
                                style={{ width: "90px" }}
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(0);
                                }}
                            >
                                {[5, 10, 15, 20, 25, 30].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </Form.Select>
                        </div>

                        {/* Pagination */}
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0 justify-content-center">

                                {/* Prev */}
                                <li className={`page-item ${page === 0 || loading ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(p => Math.max(p - 1, 0))}
                                        disabled={page === 0 || loading}
                                    >
                                        &laquo;
                                    </button>
                                </li>

                                {/* Pages */}
                                {(() => {
                                    const {
                                        pages,
                                        showStartEllipsis,
                                        showEndEllipsis,
                                    } = getVisiblePages(page, pageInfo.totalPages);

                                    return (
                                        <>
                                            {/* Leading ellipsis */}
                                            {showStartEllipsis && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}

                                            {/* Page numbers */}
                                            {pages.map(p => (
                                                <li
                                                    key={p}
                                                    className={`page-item ${page === p ? "active" : ""}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(p)}
                                                        disabled={loading}
                                                    >
                                                        {p + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            {/* Trailing ellipsis */}
                                            {showEndEllipsis && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}
                                        </>
                                    );
                                })()}


                                {/* Next */}
                                <li
                                    className={`page-item ${page >= pageInfo.totalPages - 1 || loading ? "disabled" : ""
                                        }`}
                                >
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
                title={t("jobPostingsList:delete_requisition_title")}
                message={t("jobPostingsList:delete_requisition_message")}
                itemLabel={selectedReq?.code}
            />

            {/* Position Delete */}
            <DeleteConfirmationModal
                show={showDeletePosModal}
                onClose={() => {
                    setShowDeletePosModal(false);
                    setSelectedPosition(null);
                }}
                onConfirm={handleConfirmDeletePosition} title={t("jobPostingsList:delete_position_title")} message={t("jobPostingsList:delete_position_message")} itemLabel={selectedPosition?.positionName}
            />
            <ConfirmationModal
                show={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={() => {
                    setShowSubmitModal(false);
                    handleSubmitForApproval();
                }}
                // title="Direct Approval Confirmation"
                // message="This action will directly approve the selected requisition(s). Are you sure you want to continue?"
                // itemLabel={`${selectedReqIds.size} requisition(s)`}
                // confirmText="Approve"
                // confirmVariant="primary"

                title={t("jobPostingsList:submit_confirm_title")}
                message={t("jobPostingsList:submit_confirm_message")}
                confirmText={t("jobPostingsList:approve")}
                itemLabel={t("jobPostingsList:requisition_count", { count: selectedReqIds.size })}

            />




        </Container >
    );
};

export default JobPostingsList;
