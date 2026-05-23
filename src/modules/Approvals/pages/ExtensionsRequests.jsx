import React, { use, useEffect, useState, useMemo } from "react";
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
import "../../../style/css/Extensions.css";
import start_icon from "../../../assets/start_icon.png";
import history_icon from "../../../assets/history_icon.png";
import ApprovalCommentModal from "../components/ApprovalCommentModal";
import ApprovalHistoryModal from "../components/ApprovalHistoryModal";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faLayerGroup, faLocationDot } from "@fortawesome/free-solid-svg-icons";

//  Utilities
import { validateSelectedRequisitions } from "../validations/requisitionValidation";

//  Mapper
import useExtensionRequests from "../hooks/useExtensionRequests";
import MessageHistory from "../../Messages/components/messageHistory";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import { useSelector } from "react-redux";
import { FaLocationArrow } from "react-icons/fa";

//  Other module (go up to modules, then down)
// import RequisitionPositionSelector from "../../candidatePreview/components/RequisitionPositionSelector";

const ExtensionsRequests = () => {
  const { t } = useTranslation(["jobPostingsList", "common"]);

  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryReq, setSelectedHistoryReq] = useState(null);

  // Filters
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  const [selectedReqIds, setSelectedReqIds] = useState(new Set());
  // Requisition & Position state
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: "38px",
      minHeight: "38px",   // 🔥 override default 38px
      fontSize: "14px"
    }),

    valueContainer: (base) => ({
      ...base,
      height: "38px",
      padding: "0 8px"     // 🔥 remove vertical padding
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "34px"
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "14px"
    }),

    placeholder: (base) => ({
      ...base,
      fontSize: "14px"
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    })
  };
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const privileges = useSelector((state) => state.user.privileges);



  const [openThreadId, setOpenThreadId] = useState(null);
  const {
    requisitionOptions,
    positionOptions,
    requestTypeOptions,
    extensionRequests,
    setExtensionRequests,
    loadingRequisitions,
    loadingPositions,
    loadingRequestTypes,
    loadingExtensions,
    fetchRequisitions,
    fetchPositions,
    fetchRequestTypes,
    fetchExtensionRequests,
    setPositionOptions,
    approvalPage,
    threadMessagesMap,
    fetchThreadMessages,
    historyData,
    loadingHistory,
    fetchApprovalHistory,
    interviewCenters,
    fetchInterviewCenters,
    zonalDisplayMap
  } = useExtensionRequests();

  useEffect(() => {
    fetchRequisitions();
    fetchInterviewCenters();
  }, [fetchRequisitions, fetchInterviewCenters]);



  const handleToggleThread = async (threadId) => {
    if (!threadId) return;

    if (!threadMessagesMap[threadId]) {
      await fetchThreadMessages(threadId);
    }

    setOpenThreadId((prev) => (prev === threadId ? null : threadId));
  };

  const onRequisitionChange = async (req) => {
    setSelectedRequisition(req);
    setSelectedPosition(null);
    setSelectedRequestType(null);
    setPositionOptions([]);
    setExtensionRequests([]);
    setPage(0);

    if (!req?.id) return;
    await fetchPositions(req.id);
  };

  const onPositionChange = (pos) => {
    setSelectedPosition(pos);
    setPage(0);
  };

  useEffect(() => {
    if (!selectedRequisition?.id || !selectedPosition?.positionId) {
      setExtensionRequests([]);
      return;
    }

    fetchExtensionRequests({
      requisitionId: selectedRequisition.id,
      positionId: selectedPosition.positionId,
      requestTypeId: selectedRequestType?.requestTypeId,
      status,
      searchInput,
      page,
      size: pageSize,
    });
  }, [
    selectedRequisition?.id,
    selectedPosition?.positionId,
    selectedRequestType?.requestTypeId,
    status,
    searchInput,
    page,
    pageSize,
    fetchExtensionRequests,
    setExtensionRequests,
  ]);
  useEffect(() => {
    fetchRequestTypes();
  }, [fetchRequestTypes]);
  const selectedRequisitionOption = selectedRequisition
    ? {
      label: `${selectedRequisition.requisitionCode}- ${selectedRequisition.requisitionTitle}`,
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

  const requestsData = useMemo(() => {
    if (Array.isArray(extensionRequests)) return extensionRequests;
    return Object.values(extensionRequests || {});
  }, [extensionRequests]);

  const isL1 = privileges?.["L1 Approval"];
  const isL2 = privileges?.["L2 Approval"];

  const statusOptionsByApproval = {
    L1: [
      { value: "ALL", label: "All" },
      { value: "L1_PENDING", label: "L1 Pending" },
      { value: "L1_APPROVED", label: "L1 Approved" },
      { value: "L1_REJECTED", label: "L1 Rejected" },
      { value: "L2_REJECTED", label: "L2 Rejected" },
      { value: "APPROVED", label: "Approved" }
    ],
    L2: [
      { value: "ALL", label: "All" },
      { value: "L1_APPROVED", label: "L1 Approved" },
      { value: "L2_REJECTED", label: "L2 Rejected" },
      { value: "APPROVED", label: "Approved" }
    ]
  };
  const requestTypeCol = isL2 ? 3 : 2;
  const statusCol = isL2 ? 2 : 1;

  const statusOptions = useMemo(() => {
    if (isL1) return statusOptionsByApproval.L1;
    if (isL2) return statusOptionsByApproval.L2;
    return [{ value: "ALL", label: "All" }];
  }, [isL1, isL2]);

  const requestTypeDropdownOptions = useMemo(() => {
    const options = [
      {
        label: "All",
        value: "ALL",
        raw: null,
      },
      ...requestTypeOptions,
    ];

    if (isL2) {
      return options.filter(
        (opt) =>
          opt.value === "ALL" ||
          !opt.label?.toLowerCase().includes("zone office change request")
      );
    }

    return options;
  }, [isL2, requestTypeOptions]);

  const getStatusBadge = (status = "") => {
    switch (status) {
      case "L1_PENDING":
        return "warning";

      case "L1_APPROVED":
        return "info";

      case "APPROVED":
        return "success";

      case "L1_REJECTED":
      case "L2_REJECTED":
        return "danger";

      default:
        return "secondary";
    }
  };

  const formatStatus = (status = "") => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const paginatedData = extensionRequests;
  const totalPages = approvalPage?.totalPages || 0;



  const getApprovalStatus = (actionType) => {
    if (isL1) {
      return actionType === "approve"
        ? "L1_APPROVED"
        : "L1_REJECTED";
    }

    if (isL2) {
      return actionType === "approve"
        ? "APPROVED"
        : "L2_REJECTED";
    }

    return actionType === "approve"
      ? "APPROVED"
      : "REJECTED";
  };


  const handleApprovalAction = async (comment) => {
    const threadIds = Array.from(selectedReqIds);

    if (!threadIds.length) return;

    try {
      const payload = {
        conversationThreadId: threadIds,
        status: getApprovalStatus(actionType),
        comments: comment,
      };

      const res = await committeeManagementService.submitForL1L2Approval(payload);

      if (res?.success !== true) {
        toast.error(res?.data || res?.message || "Failed to submit");
        return;
      }

      toast.success(
        actionType === "approve"
          ? "Submitted for approval successfully"
          : "Submitted for rejection successfully"
      );

      setSelectedReqIds(new Set());
      setShowCommentModal(false);
      await fetchExtensionRequests({
        requisitionId: selectedRequisition?.id,
        positionId: selectedPosition?.positionId,
        requestTypeId: selectedRequestType?.requestTypeId,
        status,
        page,
        size: pageSize,
      });

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to submit"
      );
    }
  };

  const handleOpenHistory = async (req) => {
    if (!req?.conversationThreadId) {
      toast.error("Conversation thread id not found");
      return;
    }

    setSelectedHistoryReq(req);
    setShowHistoryModal(true);
    await fetchApprovalHistory(req.conversationThreadId);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [status, searchInput, pageSize]);

  const isCheckboxDisabled = (req) => {
    const status = req?.status;

    // L1 users can act only on L1_PENDING
    if (isL1) {
      return status !== "L1_PENDING";
    }

    // L2 users can act only on L1_APPROVED
    if (isL2) {
      return status !== "L1_APPROVED";
    }

    // default fallback
    return true;
  };


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
    <div className="extension_request">
      <Container fluid className="extensions-page">
        {/* ================= HEADER ================= */}
        <Row className="mb-3 align-items-center">
          <Col>
            <h5 className="page-title">{ isL1 ? "Extension/Zone Change Requests" : "Extension Requests"}</h5>
            <p className="page-subtitle">
              Review and approve or reject extensions requests
            </p>
          </Col>

        </Row>




        {/* Requisition */}


        <Row className="mb-3 align-items-end filters-row border rounded p-3 bulk-actions">

          <Col xs={12} md={4}>
            <div className="field-label">Requisition</div>
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
                onPositionChange(null);
                setPage(0);
              }}
            />
          </Col>

          {/* Position */}
          <Col xs={12} md={4}>
            <div className="field-label">Position</div>
            <Select
              styles={selectStyles}
              classNamePrefix="react-select"
              placeholder="Select Position"
              menuPortalTarget={document.body}
              options={positionOptions}
              isLoading={loadingPositions}
              value={selectedPositionOption}
              isDisabled={!selectedRequisitionOption}
              onChange={(opt) => {
                onPositionChange(opt?.raw || null);
                setPage(0);
              }}
            />
          </Col>
          <Col xs={12} md={2}>
            <div className="field-label">Request Type</div>
            <Form.Select
              className="status-select"
              value={selectedRequestType?.requestTypeId || "ALL"}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "ALL") {
                  setSelectedRequestType(null);
                } else {
                  const selected = requestTypeOptions.find(
                    (item) => item.value === value
                  );
                  setSelectedRequestType(selected?.raw || null);
                }

                setPage(0);
              }}
            >

              {requestTypeDropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={2}>
            <div className="field-label">Status</div>
            <Form.Select
              className="status-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Col>

        </Row>



        {/* ================= BULK ACTIONS ================= */}
        <Row className="align-items-center mt-4 mb-4">


          <Col xs={12} md={12} className="d-flex justify-content-end gap-2 ">
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

        {/* ================= EXTENSION REQUEST CARDS ================= */}
        {paginatedData.length === 0 ? (
          <div className="text-center text-muted my-4">
            No Extensions requests found
          </div>
        ) : (
          <>
            {paginatedData.map((req) => {
              const isOpen = openThreadId === req.conversationThreadId;

              const historyItems = (threadMessagesMap[req.conversationThreadId] || []).map(
                (msg) => ({
                  title: msg.senderType,
                  comment: msg.comments || msg.message || msg.content || "-",
                  // time: msg.createdDate
                  //   ? new Date(msg.createdDate).toLocaleString()
                  //   : "",
                  time: `${formatDate(msg.createdDate)} ${formatTime(msg.createdDate)}`,
                  attachmentPath: msg.attachmentPath || null,
                })

              );


              return (
                <div
                  key={req.conversationThreadId}
                  className="bulk-actions align-items-center mt-3 mb-3"
                >
                  <Row className="align-items-center gx-3">
                    <Col xs="auto" className="checkbox-col me-3">
                      <Form.Check
                        type="checkbox"
                        checked={selectedReqIds.has(req.conversationThreadId)}
                        disabled={isCheckboxDisabled(req)}
                        onChange={(e) => {
                          if (isCheckboxDisabled(req)) return;

                          setSelectedReqIds((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) {
                              next.add(req.conversationThreadId);
                            } else {
                              next.delete(req.conversationThreadId);
                            }
                            return next;
                          });
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <div
                        className="d-flex align-items-center gap-3"
                        style={{ cursor: "pointer" }}

                      >
                        <div className="avatar-circle">
                          {req.candidateName
                            ?.split(" ")
                            .filter(Boolean)
                            .map(word => word.charAt(0).toUpperCase())
                            .slice(0, 2)
                            .join("")}

                        </div>

                        <div className="user-info">
                          <div className="user-name-row">
                            <span className="user-name">{req.candidateName || "-"}</span>

                            <img
                              src={history_icon}
                              alt="history_icon"
                              className="icon-14 mb-2 cursor-pointer"
                              onClick={() => handleOpenHistory(req)}
                            />
                          </div>

                          <div className="user-meta">
                            <div className="reg-no">
                              Application Number: {req.applicationNo || "-"}
                            </div>

                            <div className="date-row d-flex align-items-center gap-3">

                              {/* Date */}
                              <div className="d-flex align-items-center gap-1">
                                <img
                                  src={start_icon}
                                  alt="start_icon"
                                  className="icon-14"
                                />

                                <span>
                                  {formatDate(req.createdDate)}
                                </span>
                              </div>

                              {/* Time */}
                              <div className="d-flex align-items-center gap-1">
                                <i className="bi bi-clock icon-14"></i>

                                <span>
                                  {formatTime(req.createdDate)}
                                </span>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} md={2} className="data-col">

                      <div className="d-flex align-items-start gap-2">

                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="text-muted mt-1"
                          style={{ fontSize: "18px" }}
                        />

                        <div>
                          <div className="field-label">
                            Extension Date
                          </div>

                          <div className="field-value">
                            {req.dateExtension
                              ? formatDate(req.dateExtension)
                              : "-"}
                          </div>
                        </div>

                      </div>

                    </Col>

                    <Col xs={12} md={requestTypeCol} className="data-col">

                      <div className="d-flex align-items-start gap-2">

                        <FontAwesomeIcon
                          icon={faLayerGroup}
                          className="text-muted mt-1"
                          style={{ fontSize: "18px" }}
                        />

                        <div>
                          <div className="field-label">
                            Request Type
                          </div>

                          <div className="field-value">
                            {requestTypeOptions.find(
                              (type) => type.value === req.requestTypeId
                            )?.label || "-"}
                          </div>
                        </div>


                      </div>

                    </Col>
                    {!isL2 && (
                      <Col xs={12} md={2} className="data-col">

                        <div className="d-flex align-items-start gap-2">

                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="text-muted mt-1"
                            style={{ fontSize: "18px" }}
                          />

                          <div>
                            <div className="field-label">
                              Zone Change
                            </div>

                            <div className="field-value">
                              {zonalDisplayMap[req.zonalId] || "-"}
                            </div>
                          </div>


                        </div>

                      </Col>
                    )}

                    <Col xs={12} md={statusCol} className="data-col d-flex align-items-center justify-content-between">
                      <div>
                        <Badge bg={getStatusBadge(req.status)}>
                          {formatStatus(req.status)}
                        </Badge>
                      </div>

                      <button
                        type="button"
                        className="btn btn-link p-0 ms-4"
                        onClick={() => handleToggleThread(req.conversationThreadId)}
                        style={{ textDecoration: "none" }}
                      >
                        <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                      </button>
                    </Col>
                  </Row>

                  {isOpen && (
                    <Row className="mt-3 border-top pt-3">
                      <Col xs={12}>
                        <div className="p-3 border rounded bg-white">

                          <MessageHistory item={{ history: historyItems }} />
                        </div>
                      </Col>
                    </Row>
                  )}
                </div>
              );
            })}
          </>
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
          loading={loadingHistory}
        />
      </Container>
    </div >
  );
};

export default ExtensionsRequests;
