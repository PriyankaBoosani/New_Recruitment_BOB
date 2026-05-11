import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Badge,
  Modal,
  Button,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faUsers,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import ApprovalCommentModal from "../components/ApprovalCommentModal";
import "../../../style/css/InterviewRequest.css";
const mockRequisitions = [
  {
    id: 1,
    requisitionCode: "REQ-2026-00140",
    requisitionTitle: "Requisition Approval Mail Test",
    status: "NEW",
    departmentCount: 1,
    positionsCount: 2,
    vacanciesCount: 20,
    startDate: "2026-05-10",
    endDate: "2026-05-30",
    positions: [
      {
        positionId: 101,
        positionName: "Position 1",
        departmentCount: 1,
        totalCandidateCount: 12,
        zoneCount: 2,
        panelCount: 3,
        zones: [
          { zoneId: 1, zoneName: "Zone A", center: "Hyderabad", candidates: 6 },
          { zoneId: 2, zoneName: "Zone B", center: "Warangal", candidates: 6 },
        ],
        panels: [
          { panelId: 1, panelName: "Panel 1", members: 4, status: "Active" },
          { panelId: 2, panelName: "Panel 2", members: 3, status: "Active" },
          { panelId: 3, panelName: "Panel 3", members: 2, status: "Pending" },
        ],
      },
      {
        positionId: 102,
        positionName: "Position 2",
        departmentCount: 1,
        totalCandidateCount: 8,
        zoneCount: 1,
        panelCount: 2,
        zones: [
          { zoneId: 3, zoneName: "Zone C", center: "Nizamabad", candidates: 8 },
        ],
        panels: [
          { panelId: 4, panelName: "Panel 4", members: 3, status: "Active" },
          { panelId: 5, panelName: "Panel 5", members: 2, status: "Active" },
        ],
      },
    ],
  },
];

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

  const requisitionOptions = useMemo(
    () =>
      mockRequisitions.map((req) => ({
        label: `${req.requisitionCode} - ${req.requisitionTitle}`,
        value: req.id,
        raw: req,
      })),
    []
  );

  const selectedRequisitionOption = selectedRequisition
    ? {
        label: `${selectedRequisition.requisitionCode} - ${selectedRequisition.requisitionTitle}`,
        value: selectedRequisition.id,
        raw: selectedRequisition,
      }
    : null;

  const handleRequisitionChange = (opt) => {
    setSelectedRequisition(opt?.raw || null);
    setOpenReq(true);
    setOpenPositionId(null);
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
    setActionType(type);
    setSelectedPositionForAction(position);
    setShowCommentModal(true);
  };

  const handleApprovalAction = (comment) => {
    if (!selectedPositionForAction) return;

    const payload = {
      requisitionId: selectedRequisition?.id,
      positionId: selectedPositionForAction.positionId,
      action: actionType,
      comment,
    };

    console.log("Approval payload:", payload);

    setShowCommentModal(false);
    setActionType(null);
    setSelectedPositionForAction(null);
  };

  const renderDetailTable = () => {
    if (detailModal.type === "zone") {
      return (
        <Table bordered hover responsive className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Center</th>
              <th>Candidates</th>
            </tr>
          </thead>
          <tbody>
            {detailModal.data.length > 0 ? (
              detailModal.data.map((z) => (
                <tr key={z.zoneId}>
                  <td>{z.zoneName}</td>
                  <td>{z.center}</td>
                  <td>{z.candidates}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No zone details found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }

    return (
      <Table bordered hover responsive className="mb-0 align-middle">
        <thead>
          <tr>
            <th>Panel Name</th>
            <th>Members</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {detailModal.data.length > 0 ? (
            detailModal.data.map((p) => (
              <tr key={p.panelId}>
                <td>{p.panelName}</td>
                <td>{p.members}</td>
                <td>{p.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
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
              Select requisition, expand positions, and review zone/panel details
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
            />
          </Col>
        </Row>

        {selectedRequisition ? (
          <div className="requisition-card mb-3">
            <Row
              className="align-items-center req-clickable"
              onClick={() => setOpenReq((prev) => !prev)}
            >
              <Col xs={12} md={6}>
                <div className="req-header">
                  <Badge bg="light" text="primary" className="req-id">
                    {selectedRequisition.requisitionCode}
                  </Badge>
                  <Badge bg="info" className="ms-2">
                    {selectedRequisition.status}
                  </Badge>
                </div>

                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-start">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 className="req-code mb-0">
                          {selectedRequisition.requisitionTitle}
                        </h6>
                      </div>

                      <div className="req-dates">
                        <div className="d-flex align-items-center gap-1">
                          <span>Start: {formatDateDDMMYYYY(selectedRequisition.startDate)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <span>End: {formatDateDDMMYYYY(selectedRequisition.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={4}>
                <div className="req-meta">
                  <div>
                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted me-2" />
                    Department - {selectedRequisition.departmentCount}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted me-2" />
                    Positions - {selectedRequisition.positionsCount}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted me-2" />
                    Vacancies - {selectedRequisition.vacanciesCount}
                  </div>
                </div>
              </Col>

              <Col
                xs={12}
                md={2}
                className="text-md-end mt-3 mt-md-0 actions d-flex justify-content-end align-items-center"
              >
                <button
                  type="button"
                  className="btn btn-none accordion-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenReq((prev) => !prev);
                  }}
                >
                  {openReq ? <ChevronUp /> : <ChevronDown />}
                </button>
              </Col>
            </Row>

            {openReq && (
              <div className="accordion-body mt-3">
                <div className="p-3 border rounded bg-white">
                  {selectedRequisition.positions.map((pos, index) => {
                    const isOpen = openPositionId === pos.positionId;

                    return (
                      <div key={pos.positionId} className="department-card mb-3">
                        <div
                          className="department-header d-flex align-items-center gap-2 cursor-pointer"
                          onClick={() =>
                            setOpenPositionId((prev) =>
                              prev === pos.positionId ? null : pos.positionId
                            )
                          }
                        >
                          <span className="depname">
                            Position {index + 1} - {pos.positionName}
                          </span>

                          <Badge bg="light" text="primary" className="deppos">
                            {pos.totalCandidateCount} Candidates
                          </Badge>

                          <button
                            type="button"
                            className="btn btn-none accordion-arrow-position ms-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPositionId((prev) =>
                                prev === pos.positionId ? null : pos.positionId
                              );
                            }}
                          >
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </div>

                        {isOpen && (
                          <div className="position-card-inner mt-2">
                            <div className="row g-3 mb-3">
                              <div className="col-md-3">
                                <div className="field-label">Department Count</div>
                                <div className="field-value">{pos.departmentCount}</div>
                              </div>

                              <div className="col-md-3">
                                <div className="field-label">Total Candidate Count</div>
                                <div className="field-value">{pos.totalCandidateCount}</div>
                              </div>

                              <div className="col-md-2">
                                <div className="field-label">Zone Count  <span>{pos.zoneCount}</span></div>

                               
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="d-flex align-items-center gap-2 mt-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetails("zone", pos);
                                  }}
                                >
                                 
                                View
                                </Button>
                              </div>

                              <div className="col-md-2">
                                <div className="field-label">Panel Count: <span>{pos.panelCount}</span></div>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="d-flex align-items-center gap-2 mt-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetails("panel", pos);
                                  }}
                                >
                               View
                                  
                                </Button>
                              </div>
                               <div className="col-md-2">
                              <Button className="me-2"
                                variant="success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick("approve", pos);
                                }}
                              >
                                Accept
                              </Button>
                              <Button
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
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted my-4">No requisition selected</div>
        )}

        <Modal
          show={detailModal.show}
          onHide={() => setDetailModal({ show: false, type: null, positionName: "", data: [] })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {detailModal.type === "zone" ? "Zone Details" : "Panel Details"} - {detailModal.positionName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{renderDetailTable()}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
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