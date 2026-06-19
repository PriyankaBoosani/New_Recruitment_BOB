import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import "../../../style/css/OfferLetterRequestApproval.css";

const OfferLetterRequestApproval = () => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const requisitionOptions = [
    { value: 1, label: "REQ-001 - React Developer Hiring" },
    { value: 2, label: "REQ-002 - UI Developer Hiring" },
  ];

  const positionOptions = [
    { value: 1, label: "React Developer" },
    { value: 2, label: "UI Developer" },
  ];

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const candidates = [
    {
      id: 1,
      name: "John Doe",
      applicationNumber: "APP001",
      caste: "OC",
      score: 89,
      qualification: "Q",
      status: "Pending",
      joiningDate: "15-07-2026",
      state: "Telangana",
      city: "Hyderabad",
      offerReleaseDate: "01-07-2026",
      acceptBefore: "10-07-2026",
    },
    {
      id: 2,
      name: "Jane Smith",
      applicationNumber: "APP002",
      caste: "BC",
      score: 85,
      qualification: "Q",
      status: "Pending",
      joiningDate: "20-07-2026",
      state: "Karnataka",
      city: "Bangalore",
      offerReleaseDate: "02-07-2026",
      acceptBefore: "12-07-2026",
    },
  ];
  const allSelected =
    candidates.length > 0 &&
    candidates.every((item) => selectedIds.has(item.id));

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
      height: "38px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="offer-letter-request-page">
      <Container fluid className="offerletter-page">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h5 className="offer-page-title">Offer Letter Requests</h5>

            <p className="offer-page-subtitle">
              Review and approve offer letter requests
            </p>
          </Col>
        </Row>
        {/* Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <div className="offer-filter-label">Requisition</div>

            <Select
              styles={selectStyles}
              options={requisitionOptions}
              value={selectedRequisition}
              onChange={setSelectedRequisition}
              placeholder="Select Requisition"
              menuPortalTarget={document.body}
            />
          </Col>

          <Col md={4}>
            <div className="offer-filter-label">Position</div>

            <Select
              styles={selectStyles}
              options={positionOptions}
              value={selectedPosition}
              onChange={setSelectedPosition}
              placeholder="Select Position"
              menuPortalTarget={document.body}
            />
          </Col>
        </Row>
        {/* Bulk Actions */}
        <Row className="offer-bulk-actions align-items-center mb-3">
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Select All"
              checked={allSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(new Set(candidates.map((item) => item.id)));
                } else {
                  setSelectedIds(new Set());
                }
              }}
            />
          </Col>

          <Col md={6} className="d-flex justify-content-end gap-2">
            <Button variant="outline-danger" className="offer-reject-btn">
              Reject
            </Button>

            <Button variant="outline-success" className="offer-approve-btn">
              Approve
            </Button>
          </Col>
        </Row>
        {/* Cards */}
        
        <table responsive bordered hover className="offer-request-table mt-5">
          <thead>
            <tr>
              <th></th>
              <th>Candidate Name</th>
              <th>Application Number</th>
              <th>Score</th>
              <th>Q/NQ</th>
              <th>Status</th>
              <th>Joining Date</th>
              <th>State</th>
              <th>City</th>
              <th>Offer Release Date</th>
              <th>Accept Before</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedIds.has(candidate.id)}
                    onChange={(e) => {
                      const updated = new Set(selectedIds);

                      if (e.target.checked) {
                        updated.add(candidate.id);
                      } else {
                        updated.delete(candidate.id);
                      }

                      setSelectedIds(updated);
                    }}
                  />
                </td>

                <td>{candidate.name}</td>
                <td>{candidate.applicationNumber}</td>
                <td>{candidate.score}</td>
                <td>{candidate.qualification}</td>
                <td>{candidate.status}</td>
                <td>{candidate.joiningDate}</td>
                <td>{candidate.state}</td>
                <td>{candidate.city}</td>
                <td>{candidate.offerReleaseDate}</td>
                <td>{candidate.acceptBefore}</td>

                <td>
                  <Button size="sm" variant="outline-primary">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </Container>
    </div>
  );
};

export default OfferLetterRequestApproval;
