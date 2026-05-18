import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Badge,
  Modal,
  Button,
  Table,
  OverlayTrigger,
} from "react-bootstrap";
import Select from "react-select";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import ApprovalCommentModal from "../components/ApprovalCommentModal";
import "../../../style/css/InterviewRequest.css";
import mingcute_department_line from "../../../assets/mingcute_department-line.png";
import start_icon from "../../../assets/start_icon.png"
import end_icon from "../../../assets/end_icon.png"
import I_icon from "../../../assets/I_icon.png"
import position_Icon from "../../../assets/position_Icon.png"
import useInterviewSchedule from "../hooks/useInterviewSchedule";
import { toast } from "react-toastify";
import { Tooltip } from "react-bootstrap";

// const mockRequisitions = [
//   {
//     id: 1,
//     requisitionCode: "REQ-2026-00140",
//     requisitionTitle: "Requisition Approval Mail Test",
//     status: "NEW",
//     departmentName: "2",
//     positionsCount: 2,
//     vacanciesCount: 20,
//     startDate: "2026-05-10",
//     endDate: "2026-05-30",
//     positions: [
//       {
//         positionId: 101,
//         positionName: "Position 1",
//         departmentName: "SBI",
//         totalCandidateCount: 132,
//         zoneCount: 2,
//         panelCount: 3,
//         zones: [
//           { zoneId: 1, zoneName: "Hyderabad", candidates: 6 },
//           { zoneId: 2, zoneName: "Warangal", candidates: 6 },
//         ],
//         panels: [
//           { panelId: 1, panelName: "Panel 1", members: 4, date: "2026-05-10" },
//           { panelId: 2, panelName: "Panel 2", members: 3, date: "2026-05-10" },
//           { panelId: 3, panelName: "Panel 3", members: 2, date: "2026-05-10" },
//         ],
//       },
//       {
//         positionId: 102,
//         positionName: "Position 2",
//         departmentName: "SBI",
//         totalCandidateCount: 8,
//         zoneCount: 1,
//         panelCount: 2,
//         zones: [
//           { zoneId: 3, zoneName: "Nizamabad", candidates: 8 },
//         ],
//         panels: [
//           { panelId: 4, panelName: "Panel 4", members: 3, date: "2026-05-10" },
//           { panelId: 5, panelName: "Panel 5", members: 2, date: "2026-05-10" },
//         ],
//       },
//     ],
//   },
// ];

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

const InterviewRequests = () => {
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [openReq, setOpenReq] = useState(true);
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

  // const requisitionOptions = useMemo(
  //   () =>
  //     mockRequisitions.map((req) => ({
  //       label: `${req.requisitionCode} - ${req.requisitionTitle}`,
  //       value: req.id,
  //       raw: req,
  //     })),
  //   []
  // );

  const selectedRequisitionOption = selectedRequisition
    ? {
      label: `${selectedRequisition.requisitionCode} - ${selectedRequisition.requisitionTitle}`,
      value: selectedRequisition.id,
      raw: selectedRequisition,
    }
    : null;

  const handleRequisitionChange = (opt) => {
    const requisition = opt?.raw || null;
    setSelectedRequisition(requisition);
    setOpenReq(true);
    setOpenPositionId(null);

    fetchPositionDetailsByRequisition(opt?.value);
  };

  const openDetails = (type, position) => {
    setDetailModal({
      show: true,
      type,
      positionName: position.positionName,
      data: type === "zone" ? position.zonalData || [] : position.panelData || [],
    });
  };

  const handleActionClick = (type, position) => {
    const positionId = position.positionId || position.jobPositionId;

    if (!positionId) {
      toast.error("Position ID not found");
      return;
    }

    setActionType(type); // approve / reject
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
        fetchPositionDetailsByRequisition(selectedRequisition.id);
      }
    } catch (error) {
      console.error("Approval submission failed:", error);
    } finally {
      setShowCommentModal(false);
      setActionType(null);
      setSelectedPositionForAction(null);
    }
  };
  const {
    requisitionOptions,
    loadingRequisitions,
    fetchRequisitions,
    positionDetails,
    loadingPositionDetails,
    fetchPositionDetailsByRequisition,
    submitL1Approval,
    loadingL1Approval
  } = useInterviewSchedule();
  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

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
                  {p.members?.length > 0
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
                  const isOpen = openPositionId === (pos.positionId || pos.jobPositionId);

                  return (
                    <div key={pos.positionId || pos.jobPositionId} className="department-card mb-3">
                      <div
                        className="department-header d-flex align-items-center gap-2 cursor-pointer"
                        onClick={() =>
                          setOpenPositionId((prev) =>
                            prev === (pos.positionId || pos.jobPositionId)
                              ? null
                              : (pos.positionId || pos.jobPositionId)
                          )
                        }
                      >
                        <span className="depname">{pos.positionName}</span>

                        <button
                          type="button"
                          className="btn btn-none accordion-arrow-position ms-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPositionId((prev) =>
                              prev === (pos.positionId || pos.jobPositionId)
                                ? null
                                : (pos.positionId || pos.jobPositionId)
                            );
                          }}
                        >
                          {isOpen ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>

                      {isOpen && (
                        <div className="position-card-inner mt-2">
                          <div className="row g-3">
                            <div className="col-md-3">
                              <div className="field-label">
                                Department: <span className="field-value">{pos.departmentName}</span>
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="field-label">
                                Scheduled Candidates: <span className="field-value">{pos.totalCandidateCount || 0}</span>
                              </div>
                            </div>

                            <div className="col-md-2">
                              <div className="field-label">
                                Zone Count:{" "}
                                <span className="field-value">{pos.totalZonalCount || 0}</span>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={<Tooltip id={`tooltip-zone-${pos.id}`}>View Zone Details</Tooltip>}
                                >
                                  <span>
                                    <img
                                      src={I_icon}
                                      alt="View Details"
                                      className="ms-2"
                                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
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
                                  overlay={<Tooltip id={`tooltip-panel-${pos.id}`}>View Panel Details</Tooltip>}
                                >
                                  <span>
                                    <img
                                      src={I_icon}
                                      alt="View Details"
                                      className="ms-2"
                                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick("approve", pos);
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                className="fs-14"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick("reject", pos);
                                }}
                              >
                                Reject
                              </Button>
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
              onClick={() => setDetailModal({ show: false, type: null, positionName: "", data: [] })}
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