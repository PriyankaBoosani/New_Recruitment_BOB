import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Badge
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { CommitteeRequestsData } from "../hooks/committee.static";

import "../../../style/css/ApprovalCommitee.css";
import history_icon from "../../../assets/history_icon.png";

import ApprovalCommentModal from "../components/ApprovalCommentModal";
import ApprovalHistoryModal from "../components/ApprovalHistoryModal";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import { toast } from "react-toastify";

//  Utilities
import { validateSelectedRequisitions } from "../validations/requisitionValidation";

//  Mapper
import { mapCommitteeRequests } from "../mapper/committeeRequestMapper";


const CommitteeRequests = () => {
    const { t } = useTranslation(["jobPostingsList", "common"]);

    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedHistoryReq, setSelectedHistoryReq] = useState(null);

    // Filters
    const [status, setStatus] = useState("ALL");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(0);

    const [selectedReqIds, setSelectedReqIds] = useState(new Set());
    const [committeeRequests, setCommitteeRequests] = useState(() => 
        mapCommitteeRequests(CommitteeRequestsData)
    );
    // Requisition & Position state
    const [selectedRequisition, setSelectedRequisition] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    // Options (reuse same shape as existing selector)
    const requisitions = [];
    const positions = [];

    const selectedRequisitionOption = selectedRequisition
        ? {
            label: selectedRequisition.requisitionCode,
            value: selectedRequisition.id,
            raw: selectedRequisition
        }
        : null;

    const selectedPositionOption = selectedPosition
        ? {
            label: selectedPosition.positionName,
            value: selectedPosition.id,
            raw: selectedPosition
        }
        : null;
    const onRequisitionChange = (req) => {
        setSelectedRequisition(req);
        setSelectedPosition(null);
        setPage(0);
    };

    const onPositionChange = (pos) => {
        setSelectedPosition(pos);
        setPage(0);
    };


    // Filter and paginate data
    const getFilteredData = () => {
        let filtered = [...committeeRequests];

        // Filter by status
        if (status && status !== "ALL") {
            filtered = filtered.filter(
                req => req.status.toUpperCase() === status.toUpperCase()
            );
        }

        // Filter by search
        if (searchInput.trim() !== "") {
            const searchLower = searchInput.toLowerCase();
            filtered = filtered.filter(
                req =>
                    req.positionName.toLowerCase().includes(searchLower) ||
                    req.requisitionId.toLowerCase().includes(searchLower) ||
                    req.panelType.toLowerCase().includes(searchLower) ||
                    req.panelMembers.some(member =>
                        member.toLowerCase().includes(searchLower)
                    )
            );
        }

        return filtered;
    };

    const getPaginatedData = () => {
        const filtered = getFilteredData();
        const start = page * pageSize;
        const end = start + pageSize;
        return filtered.slice(start, end);
    };

    const getTotalPages = () => {
        const filtered = getFilteredData();
        return Math.ceil(filtered.length / pageSize);
    };

    const handleApprovalAction = (comment, type) => {
        const ids = Array.from(selectedReqIds);

        if (ids.length === 0) return;

        if (type === "approve") {
            console.log("Approving:", ids, "Comment:", comment);
            setCommitteeRequests(prev =>
                prev.map(req =>
                    ids.includes(req.id) ? { ...req, status: "Approved" } : req
                )
            );
            toast.success("Committee requests approved successfully");
        }

        if (type === "reject") {
            console.log("Rejecting:", ids, "Comment:", comment);
            setCommitteeRequests(prev =>
                prev.map(req =>
                    ids.includes(req.id) ? { ...req, status: "Rejected" } : req
                )
            );
            toast.success("Committee requests rejected successfully");
        }

        setSelectedReqIds(new Set());
        setShowCommentModal(false);
    };

    const handleOpenHistory = (req) => {
        setSelectedHistoryReq(req);

        setHistoryData([
            {
                requester: "HR Department",
                requestDate: req.startDate,
                approver: "Manager",
                approvalDate: "18-11-2025",
                status: req.status,
                comments: req.status === "Approved" ? "Committee approved successfully" : "Pending review"
            }
        ]);

        setShowHistoryModal(true);
    };

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [status, searchInput, pageSize]);

    const paginatedData = getPaginatedData();
    const totalPages = getTotalPages();

    const selectableRequests = paginatedData.filter(
        r => r.status !== "Approved"
    );

    const allSelected =
        selectableRequests.length > 0 &&
        selectableRequests.every(r => selectedReqIds.has(r.id));

    // const getStatusBadgeVariant = (status) => {
    //     switch (status.toLowerCase()) {
    //         case "approved":
    //             return "success";
    //         case "pending":
    //             return "warning";
    //         case "rejected":
    //             return "danger";
    //         default:
    //             return "secondary";
    //     }
    // };

    const getVisiblePages = (currentPage, totalPages) => {
        const windowSize = 3;

        let start = currentPage - 1;
        let end = currentPage + 2;

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
        <Container fluid className="committee-page">
            {/* ================= HEADER ================= */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5 className="page-title">Committee Requests</h5>
                    <p className="page-subtitle">
                        Review and approve or reject committee requests
                    </p>
                </Col>
                <Col xs={12} md={4}>
                    <div className="search-boxpost">
                        <Search />
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="mb-3 align-items-end filters-row">

                {/* Requisition */}
                <Col xs={12} md={5}>
                    <div className="filter-label">Requisition</div>
                    <Select
                        classNamePrefix="filter-select"
                        isClearable
                        options={requisitions}
                        value={selectedRequisitionOption}
                        onChange={(opt) => {
                            onRequisitionChange?.(opt?.raw || null);
                            onPositionChange?.(null);
                            setPage(0);
                        }}
                    />
                </Col>

                {/* Position */}
                <Col xs={12} md={5}>
                    <div className="filter-label">Position</div>
                    <Select
                        classNamePrefix="filter-select"
                        isClearable
                        options={positions}
                        value={selectedPositionOption}
                        isDisabled={!selectedRequisitionOption}
                        onChange={(opt) => {
                            onPositionChange?.(opt?.raw || null);
                            setPage(0);
                        }}
                    />
                </Col>

                {/* Status (right aligned like screenshot) */}
                <Col xs={12} md={1} className="ms-auto">
                    {/* <div className="filter-label">Status</div> */}
                    <Form.Select
                        className="status-select"
                        value={status}
                        onChange={(e) => {
                            const value = e.target.value || null;
                            setStatus(value);
                            setPage(0);
                        }}
                    >
                        <option value="ALL">{t("jobPostingsList:status_all")}</option>
                        <option value="NEW">{t("jobPostingsList:status_new")}</option>
                        <option value="APPROVED">{t("jobPostingsList:status_approved")}</option>
                    </Form.Select>
                </Col>

            </Row>


            {/* ================= BULK ACTIONS ================= */}
            <Row className="bulk-actions align-items-center mt-3 mb-3">
                <Col xs={12} md={6} className="selectcheck">
                    <Form.Check
                        type="checkbox"
                        id="select-all-requests"
                        className="select-checkbox"
                        label="Select All"
                        checked={allSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedReqIds(
                                    new Set(selectableRequests.map(r => r.id))
                                );
                            } else {
                                setSelectedReqIds(new Set());
                            }
                        }}
                    />
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end gap-2">
                    <Button
                        variant="outline-danger"
                        className="px-4 reject-btn"
                        disabled={selectedReqIds.size === 0}
                        onClick={() => {
                            const errors = validateSelectedRequisitions(selectedReqIds);

                            if (errors.length > 0) {
                                errors.forEach(err => toast.error(err));
                                return;
                            }
                            setActionType("reject");
                            setShowCommentModal(true);
                        }}
                    >
                        Reject
                    </Button>

                    <Button
                        variant="outline-success"
                        className="px-4 approve-btn"
                        disabled={selectedReqIds.size === 0}
                        onClick={() => {
                            const errors = validateSelectedRequisitions(selectedReqIds);

                            if (errors.length > 0) {
                                errors.forEach(err => toast.error(err));
                                return;
                            }

                            setActionType("approve");
                            setShowCommentModal(true);
                        }}
                    >
                        Approve
                    </Button>
                </Col>
            </Row>

            {/* ================= COMMITTEE REQUEST CARDS ================= */}
            {paginatedData.length === 0 ? (
                <div className="text-center text-muted my-4">
                    No committee requests found
                </div>
            ) : (
                paginatedData.map((req) => (
                    <div key={req.id} className="bulk-actions align-items-center mt-3 mb-1">
                        <Row className="align-items-center gx-3">
                            {/* Checkbox */}
                            <Col xs="auto" className="checkbox-col me-3">
                                <Form.Check 
                                    type="checkbox"
                                    className="select-checkbox"
                                    checked={selectedReqIds.has(req.id)}
                                    disabled={req.status === "Approved"}
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
                            </Col>

                            {/* Requisition */}
                            <Col xs="auto" md={2} className="data-col">
                                <div className="field-label">Requisition  <img
                                    src={history_icon} alt="history_icon"
                                    className="icon-14"
                                    onClick={() => handleOpenHistory(req)}
                                /></div>
                                <div className="d-flex align-items-center gap-1">

                                    <span className="field-value requisition-text">
                                        {req.requisitionId}
                                    </span>

                                </div>

                            </Col>

                            {/* Position */}
                            <Col xs={12} md={2} className="data-col">
                                <div className="field-label">Position</div>
                                <div className="field-value">{req.positionName}</div>
                            </Col>

                            {/* Panel Type */}
                            <Col xs={12} md={1} className="data-col">
                                <div className="field-label">Panel Type</div>
                                <div className="field-value">{req.panelType}</div>
                            </Col>

                            {/* Panel Members */}
                            <Col xs={12} md={2} className="data-col">
                                <div className="field-label">Panel Members</div>
                                <div className="field-value">
                                    {req.panelMembers.join(", ")}
                                </div>
                            </Col>

                            {/* Start Date */}
                            <Col xs={12} md={1} className="data-col">
                                <div className="field-label">Start Date</div>
                                <div className="field-value">{req.startDate}</div>
                            </Col>

                            {/* End Date */}
                            <Col xs={12} md={1} className="data-col">
                                <div className="field-label">End Date</div>
                                <div className="field-value">{req.endDate}</div>
                            </Col>

                            {/* Status */}
<Col xs={12} md={2} className="d-flex justify-content-end align-items-center"><Badge
                                    bg={req.statusType}
                                    className={`status-badge status-${req.status.toLowerCase()}`}
                                >
                                    {req.status}
                                </Badge>


                            </Col>
                        </Row>
                    </div>
                ))
            )}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
                <Row className="mt-4 mb-4">
                    <Col className="d-flex justify-content-end align-items-center gap-3">
                        {/* Page size */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold pagesize">Page Size:</span>
                            <Form.Select
                                size="sm"
                                style={{ width: "90px" }}
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
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
                                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(p => Math.max(p - 1, 0))}
                                        disabled={page === 0}
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
                                    } = getVisiblePages(page, totalPages);

                                    return (
                                        <>
                                            {showStartEllipsis && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}

                                            {pages.map(p => (
                                                <li
                                                    key={p}
                                                    className={`page-item ${page === p ? "active" : ""}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(p)}
                                                    >
                                                        {p + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            {showEndEllipsis && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Next */}
                                <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= totalPages - 1}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            )}

            {/* Modals */}
            <ApprovalCommentModal
                show={showCommentModal}
                actionType={actionType}
                onClose={() => setShowCommentModal(false)}
                onConfirm={handleApprovalAction}
            />
            <ApprovalHistoryModal
                show={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                historyData={historyData}
            />
        </Container>
    );
};

export default CommitteeRequests;
