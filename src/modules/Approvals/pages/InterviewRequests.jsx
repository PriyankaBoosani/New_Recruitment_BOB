import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Badge,
  Modal,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import ApprovalCommentModal from "../components/ApprovalCommentModal";
import "../../../style/css/InterviewRequest.css";
import start_icon from "../../../assets/start_icon.png";
import I_icon from "../../../assets/I_icon.png";
import useInterviewSchedule from "../hooks/useInterviewSchedule";
import { toast } from "react-toastify";

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
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

const formatDateDDMMYYYY = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};
const InterviewRequests = () => {
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [openPositionId, setOpenPositionId] = useState(null);

  const [detailModal, setDetailModal] = useState({
    show: false,
    type: null,
    positionName: "",
    data: [],
  });

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedPositionForAction, setSelectedPositionForAction] = useState(null);

  const [openHistoryId, setOpenHistoryId] = useState(null);

  const {
    requisitionOptions,
    loadingRequisitions,
    fetchRequisitions,
    positionDetails,
    loadingPositionDetails,
    fetchPositionDetailsByRequisition,
    submitL1Approval,
  } = useInterviewSchedule();

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
  const formatStatus = (status = "") => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const getStatusBadge = (status = "") => {
    switch (status) {
      case "L1_PENDING":
        return "warning";

      case "APPROVED":
        return "success";
      case "REJECTED":

        return "danger";
      default:
        return "secondary";
    }
  };

  const handleRequisitionChange = (opt) => {
    const requisition = opt?.raw || null;
    setSelectedRequisition(requisition);
    setOpenPositionId(null);
    setOpenHistoryId(null);
    fetchPositionDetailsByRequisition(opt?.value);
  };

  const openDetails = (type, position) => {
    setDetailModal({
      show: true,
      type,
      positionName: position.positionName,
      data: type === "zone" ? position.zones || [] : position.panels || [],
    });
  };

  const handleActionClick = (type, position) => {
    const positionId = position.positionId || position.jobPositionId;

    if (!positionId) {
      toast.error("Position ID not found");
      return;
    }

    setActionType(type);
    setSelectedPositionForAction(position);
    setShowCommentModal(true);
  };

  const handleApprovalAction = async (comment) => {
    if (!selectedPositionForAction) return;

    const positionId =
      selectedPositionForAction.positionId || selectedPositionForAction.jobPositionId;

    const status = actionType === "approve" ? "APPROVED" : "REJECTED";

    try {
      await submitL1Approval({
        positionIds: [positionId],
        status,
        remarks: comment || "",
      });

      if (selectedRequisition?.id) {
        await fetchPositionDetailsByRequisition(selectedRequisition.id);
      }
    } catch (error) {
      console.error("Approval submission failed:", error);
    } finally {
      setShowCommentModal(false);
      setActionType(null);
      setSelectedPositionForAction(null);
    }
  };

  const renderDetailTable = () => {
    if (detailModal.type === "zone") {
      return (
        <Table bordered hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Candidates</th>
            </tr>
          </thead>
          <tbody>
            {detailModal.data.length > 0 ? (
              detailModal.data.map((z) => (
                <tr key={z.zonalId || z.zoneId}>
                  <td>{z.zoneName || "-"}</td>
                  <td>{z.candidateCount ?? z.candidates ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted">
                  No zone details found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }

    return (
      <Table bordered hover className="mb-0 align-middle">
        <thead>
          <tr>
            <th>Panel Name</th>
            <th>Members</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {detailModal.data.length > 0 ? (
            detailModal.data.map((p) => (
              <tr key={p.panelId}>
                <td>{p.panelName || "-"}</td>
                <td>
                  {Array.isArray(p.members) && p.members.length > 0
                    ? p.members.map((member) => member.name).join(", ")
                    : "-"}
                </td>
                <td>{formatDateDDMMYYYY(p.startDate)}</td>
                <td>{formatDateDDMMYYYY(p.endDate)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No panel details found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="interview_requests">
      <Container fluid className="interview-page">
        <Row className="mb-3 align-items-center">
          <Col>
            <h5 className="page-title">Interview Schedule Request</h5>
            <p className="page-subtitle">
              Review and approve or reject interview schedule request.
            </p>
          </Col>
        </Row>

        <Row className="mb-3 align-items-end filters-row border rounded p-3 bulk-actions">
          <Col xs={12} md={4}>
            <div className="field-label">Requisition</div>
            <Select
              placeholder="Select Requisition"
              styles={selectStyles}
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              options={requisitionOptions}
              value={selectedRequisitionOption}
              onChange={handleRequisitionChange}
              isLoading={loadingRequisitions}
            />
          </Col>
        </Row>

        {selectedRequisition && (
          <div className="mb-3">
            <div className="p-3 border rounded bg-white">
              {loadingPositionDetails ? (
                <div className="text-muted p-3">Loading position details...</div>
              ) : positionDetails.length > 0 ? (
                positionDetails.map((pos) => {
                  const positionKey = pos.positionId || pos.jobPositionId;
                  const isPositionOpen = openPositionId === positionKey;

                  return (
                    <div key={positionKey} className="department-card mb-3">
                      <div
                        className="department-header d-flex align-items-center gap-2 cursor-pointer"
                        onClick={() =>
                          setOpenPositionId((prev) => (prev === positionKey ? null : positionKey))
                        }
                      >
                        {/* <span className="depname">{pos.positionName}</span> */}

                        <div className="d-flex align-items-center gap-2">
                          <span className="depname">{pos.positionName}</span>

                          <Badge bg={getStatusBadge(pos.status)}>
                            {formatStatus(pos.status)}
                          </Badge>
                        </div>

                        <button
                          type="button"
                          className="btn btn-none accordion-arrow-position ms-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPositionId((prev) => (prev === positionKey ? null : positionKey));
                          }}
                        >
                          {isPositionOpen ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>

                      {isPositionOpen && (
                        <div className="position-card-inner mt-2">
                          <div className="row g-3">
                            <div className="col-md-3">
                              <div className="field-label">
                                Department:{" "}
                                <span className="field-value">{pos.departmentName}</span>
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="field-label">
                                Scheduled Candidates:{" "}
                                <span className="field-value">
                                  {pos.totalCandidateCount || 0}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-2">
                              <div className="field-label">
                                Zone Count:{" "}
                                <span className="field-value">{pos.totalZonalCount || 0}</span>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id={`tooltip-zone-${positionKey}`}>
                                      View Zone Details
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <img
                                      src={I_icon}
                                      alt="View Details"
                                      className="ms-2"
                                      style={{ width: 16, height: 16, cursor: "pointer" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDetails("zone", pos);
                                      }}
                                    />
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </div>

                            <div className="col-md-2">
                              <div className="field-label">
                                Panel Count:{" "}
                                <span className="field-value">{pos.totalPanelCount || 0}</span>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id={`tooltip-panel-${positionKey}`}>
                                      View Panel Details
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <img
                                      src={I_icon}
                                      alt="View Details"
                                      className="ms-2"
                                      style={{ width: 16, height: 16, cursor: "pointer" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDetails("panel", pos);
                                      }}
                                    />
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </div>

                            <div className="col-md-2">
                              <Button
                                className="me-2 fs-14"
                                variant="success"
                                disabled={!pos.canTakeAction}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick("approve", pos);
                                }}
                              >
                                Approve
                              </Button>

                              <Button
                                className="fs-14"
                                variant="danger"
                                disabled={!pos.canTakeAction}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick("reject", pos);
                                }}
                              >
                                Reject
                              </Button>
                            </div>

                            <div className="historyposition-card-inner mt-3">
                              <div className="d-flex align-items-center gap-2 mb-3">
                                <img
                                  src={start_icon}
                                  alt="History"
                                  style={{ width: 18, height: 18 }}
                                />
                                <span className="hisname">History</span>
                              </div>

                              {pos.history?.length > 0 ? (
                                pos.history.map((item) => {
                                  const isHistoryOpen = openHistoryId === item.id;

                                  return (
                                    <div key={item.id} className="department-card mb-3 history-card">
                                      <div
                                        className="history-summary-row"
                                        onClick={() =>
                                          setOpenHistoryId((prev) =>
                                            prev === item.id ? null : item.id
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        <div className="row g-3 align-items-center">
                                          <div className="col-md-3">
                                            <button
                                              type="button"
                                              className="btn p-0 border-0 bg-transparent d-flex align-items-center gap-2 w-100 text-start"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenHistoryId((prev) =>
                                                  prev === item.id ? null : item.id
                                                );
                                              }}
                                            >
                                              {isHistoryOpen ? (
                                                <ChevronUp size={18} />
                                              ) : (
                                                <ChevronDown size={18} />
                                              )}
                                              <div className="field-label">
                                                Date:{" "}
                                                <span className="field-value mb-0">
                                                  {formatDateTime(item.date)}
                                                </span>
                                              </div>
                                            </button>
                                          </div>

                                          <div className="col-md-3">
                                            <div className="field-label">
                                              Scheduled Candidates:{" "}
                                              <span className="field-value">
                                                {item.totalCandidateCount || 0}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="col-md-2">
                                            <div className="field-label">
                                              Zone Count:{" "}
                                              <span className="field-value">
                                                {item.totalZonalCount || 0}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="col-md-2">
                                            <div className="field-label">
                                              Panel Count:{" "}
                                              <span className="field-value ms-1">
                                                {item.totalPanelCount || 0}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="col-md-2">
                                            <Badge bg={getStatusBadge(item.status)}>
                                            {formatStatus(item.status)}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>

                                      {isHistoryOpen && (
                                        <div className="history-details-wrap mt-2">
                                          <div className="row g-3">
                                            <div className="col-md-6">
                                              <div className="field-label mb-2">
                                                Zone Details ({item.zones?.length || 0})
                                              </div>

                                              <Table bordered hover className="mb-0 align-middle">
                                                <thead>
                                                  <tr>
                                                    <th>Zone Name</th>
                                                    <th>Candidates</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {item.zones?.length > 0 ? (
                                                    item.zones.map((z, idx) => (
                                                      <tr key={idx}>
                                                        <td>{z.zoneName || "-"}</td>
                                                        <td>{z.candidateCount ?? 0}</td>
                                                      </tr>
                                                    ))
                                                  ) : (
                                                    <tr>
                                                      <td
                                                        colSpan="2"
                                                        className="text-center text-muted"
                                                      >
                                                        No zone details found
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                              </Table>
                                            </div>

                                            <div className="col-md-6">
                                              <div className="field-label mb-2">
                                                Panel Details ({item.panels?.length || 0})
                                              </div>

                                              <Table bordered hover className="mb-0 align-middle">
                                                <thead>
                                                  <tr>
                                                    <th>Panel Name</th>
                                                    <th>Members</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {item.panels?.length > 0 ? (
                                                    item.panels.map((p, idx) => (
                                                      <tr key={idx}>
                                                        <td>{p.panelName || "-"}</td>
                                                        <td>
                                                          {Array.isArray(p.members) &&
                                                            p.members.length > 0
                                                            ? p.members.map((m) => m.name).join(", ")
                                                            : "-"}
                                                        </td>
                                                        <td>{formatDateDDMMYYYY(p.startDate)}</td>
                                                        <td>{formatDateDDMMYYYY(p.endDate)}</td>
                                                      </tr>
                                                    ))
                                                  ) : (
                                                    <tr>
                                                      <td
                                                        colSpan="4"
                                                        className="text-center text-muted"
                                                      >
                                                        No panel details found
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                              </Table>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-muted">No history found</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted my-4">No position details found</div>
              )}
            </div>
          </div>
        )}

        <Modal
          show={detailModal.show}
          className="interviewmodal"
          onHide={() => setDetailModal({ show: false, type: null, positionName: "", data: [] })}
          centered
          size="lg"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="bluefont">
              {detailModal.type === "zone" ? "Zone Details" : "Panel Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{renderDetailTable()}</Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              variant="outline-secondary"
              onClick={() =>
                setDetailModal({ show: false, type: null, positionName: "", data: [] })
              }
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <ApprovalCommentModal
          show={showCommentModal}
          actionType={actionType}
          onClose={() => setShowCommentModal(false)}
          onConfirm={handleApprovalAction}
        />
      </Container>
    </div>
  );
};

export default InterviewRequests;