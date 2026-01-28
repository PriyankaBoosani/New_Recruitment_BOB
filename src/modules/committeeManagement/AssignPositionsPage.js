import React, { useState } from "react";
import { Card, Button, Row, Form ,Col } from "react-bootstrap";
import { FiFilter, FiDownload, FiPlus, FiX } from "react-icons/fi";
import "../../style/css/Committee.css";
import CommitteeHistoryList from './components/CommitteeHistoryList';
// Mock data for demonstration
const COMMITTEES = {
  SCREENING: [
    { id: 1, name: "Screening Panel 1", members: ["Vijay V", "Satish J"] },
    { id: 2, name: "Screening Panel 2", members: ["Naresh P", "Veeresh V"] },
  ],
  INTERVIEW: [
    { id: 3, name: "Interview Panel 1", members: ["Bharat T", "Sathvik P"] },
    { id: 4, name: "Interview Panel 2", members: ["Rahul M", "Priya K"] },
  ],
  COMPENSATION: [
    { id: 5, name: "Compensation Panel 1", members: ["Anita R", "Rajesh K"] },
  ]
};

const AssignPositionsPage = () => {
  const [activeTab, setActiveTab] = useState("SCREENING");
  const [showHistory, setShowHistory] = useState(true);

  const [selectedCommittees, setSelectedCommittees] = useState({
    SCREENING: [],
    INTERVIEW: [],
    COMPENSATION: []
  });
  const [context, setContext] = useState({
    requisitionId: "1",
    positionId: "1"
  });

  const toggleCommittee = (type, committee) => {
    setSelectedCommittees(prev => {
      const isSelected = prev[type].some(c => c.id === committee.id);
      if (isSelected) {
        return {
          ...prev,
          [type]: prev[type].filter(c => c.id !== committee.id)
        };
      } else {
        return {
          ...prev,
          [type]: [...prev[type], committee]
        };
      }
    });
  };

  const renderCommitteeList = (committees, type) => {
    return (
      <div className="committee-list">
        {committees.map(committee => {
          const isSelected = selectedCommittees[type].some(c => c.id === committee.id);
          return (
            <div 
              key={committee.id} 
              className={`committee-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCommittee(type, committee)}
            >
              <div className="committee-name">{committee.name}</div>
              <div className="committee-members">
                {committee.members.join(", ")}
              </div>
              <Button 
                variant={isSelected ? 'outline-danger' : 'outline-primary'} 
                size="sm"
                className="ms-2"
              >
                {isSelected ? 'Remove' : 'Add'}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="assign-page">

      {/* OUTER CARD */}
      <Card className="p-3">
 <div className="mb-3">
        <h6 className="mb-1">Select Position</h6>
        <small className="text-muted">
          Choose a requisition and position to assign committees to.
        </small>
      </div>

     
              <Row className="g-3 align-items-end mb-4">
        <Col md={4}>
          <label className="form-label">Requisition</label>
          <select className="form-select">
            <option>BOB/HR/REC/ADVT/2025/06</option>
          </select>
        </Col>

        <Col>
          <label className="form-label">Position</label>
          <select className="form-select">
            <option>
              Product - ONDC (Open Network for Digital Commerce)
            </option>
          </select>
        </Col>

        <Col className="d-flex gap-2">
          <Button variant="secondary" disabled className="w-100">
            <FiPlus className="me-1" />
            Assign Committees
          </Button>
          <Button variant="primary" className="w-100">
            Import Committees
          </Button>
        </Col>
      </Row>
        

        {/* CARD 2: COMMITTEES */}
        <Card>
          <Card.Body>
            {/* HEADER (NEW) */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">Configure Committees</h6>
                    <small className="text-muted">
                      Assign panels to Product – ONDC
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      Cancel
                    </Button>
                    <Button variant="warning" size="sm">
                      Save Configuration
                    </Button>
                  </div>
                </div>
            {/* Tabs */}
            <div className="com-tab mb-2">
              <button
                className={`com-tab-item ${
                  activeTab === "SCREENING" ? "active" : ""
                }`}
                onClick={() => setActiveTab("SCREENING")}
              >
                Screening Committee
              </button>

              <button
                className={`com-tab-item ${
                  activeTab === "INTERVIEW" ? "active" : ""
                }`}
                onClick={() => setActiveTab("INTERVIEW")}
              >
                Interview Committee
              </button>

              <button
                className={`com-tab-item ${
                  activeTab === "COMPENSATION" ? "active" : ""
                }`}
                onClick={() => setActiveTab("COMPENSATION")}
              >
                Compensation Committee
              </button>
            </div>

            {/* Dual Panels */}
            <div className="dual-committee-box">
              <div className="available-committees">
                <h6>
                  Available Panels ({COMMITTEES[activeTab].length})
                </h6>
                {renderCommitteeList(COMMITTEES[activeTab], activeTab)}
              </div>

              <div className="divider"></div>

              <div className="selected-committees">
                <h6>
                  Selected Panels (
                  {selectedCommittees[activeTab].length})
                </h6>

                {selectedCommittees[activeTab].length > 0 ? (
                  renderCommitteeList(
                    selectedCommittees[activeTab],
                    activeTab
                  )
                ) : (
                  <div className="text-muted text-center py-4">
                    No panels selected
                  </div>
                )}
              </div>
            </div>

          </Card.Body>
        </Card>
<Card>
        <Card.Body>
         
          {showHistory && <CommitteeHistoryList />}
          {/* Existing content */}
          
        </Card.Body>
      </Card>
      </Card>
    </div>
  );
};

export default AssignPositionsPage;
