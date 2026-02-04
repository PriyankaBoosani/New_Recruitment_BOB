import React, { useState } from "react";
import { Card, Button, Row, Form ,Col } from "react-bootstrap";
import { FiFilter, FiDownload, FiPlus, FiX } from "react-icons/fi";
import "../../style/css/Committee.css";
import CommitteeHistoryList from './components/CommitteeHistoryList';
import { useAssignPositions } from "./hooks/useAssignPositions";



// Mock data for demonstration
// const COMMITTEES = {
//   SCREENING: [
//     { id: 1, name: "Screening Panel 1", members: ["Vijay V", "Satish J"] },
//     { id: 2, name: "Screening Panel 2", members: ["Naresh P", "Veeresh V"] },
//   ],
//   INTERVIEW: [
//     { id: 3, name: "Interview Panel 1", members: ["Bharat T", "Sathvik P"] },
//     { id: 4, name: "Interview Panel 2", members: ["Rahul M", "Priya K"] },
//   ],
//   COMPENSATION: [
//     { id: 5, name: "Compensation Panel 1", members: ["Anita R", "Rajesh K"] },
//   ]
// };

const AssignPositionsPage = () => {

  const {
  requisitions,
  positions,
  selectedRequisition,
  selectedPosition,
  setSelectedPosition,
  handleRequisitionChange,
  loading,
  availablePanels,
  setAvailablePanels,
  updateCommitteeDate,
  activeTab,
setActiveTab,
showHistory,
setShowHistory,
selectedCommittees,
setSelectedCommittees,
context,
setContext,
handleAssignCommittees

} = useAssignPositions();


  

  const toggleCommittee = (type, committee) => {
  setSelectedCommittees(prev => {
    const isSelected = prev[type].some(c => c.id === committee.id);

    if (isSelected) {
      // REMOVE → move back to available
      setAvailablePanels(ap => [...ap, committee]);

      return {
        ...prev,
        [type]: prev[type].filter(c => c.id !== committee.id),
      };
    } else {
      // ADD → remove from available
      setAvailablePanels(ap =>
        ap.filter(c => c.id !== committee.id)
      );

      return {
        ...prev,
        [type]: [
          ...prev[type],
          {
            ...committee,
            startDate: committee.startDate || "",
            endDate: committee.endDate || ""
          }
        ],
      };
    }
  });
};

const renderAvailableCommittee = (committee, type) => (
  <div className="committee-row" key={committee.id}>
    <div>
      <div className="committee-title">{committee.name}</div>
      <div className="committee-chips">
        {committee.members.map(m => (
          <span key={m} className="chip">{m.name}</span>
        ))}
      </div>
    </div>

    <button
      className="action-pill add"
      onClick={() => toggleCommittee(type, committee)}
    >
      Add →
    </button>
  </div>
);
  const renderSelectedCommittee = (committee, type) => (
  <div className="committee-row selected" key={committee.id}>
    <div>
      <div className="committee-title">{committee.name}</div>
      <div className="committee-chips">
        {committee.members.map(m => (
          <span key={m} className="chip">{m.name}</span>
        ))}
      </div>

      <div className="date-row">
        <div>
          <label>START DATE</label>
        <input
            type="date"
            value={committee.startDate}
            onChange={(e) =>
              updateCommitteeDate(type, committee.id, "startDate", e.target.value)
            }
          />
        </div>
        <div>
          <label>END DATE</label>
          <input
              type="date"
              value={committee.endDate}
              onChange={(e) =>
                updateCommitteeDate(type, committee.id, "endDate", e.target.value)
              }
            />
        </div>
      </div>
    </div>

    <button
      className="action-pill remove"
      onClick={() => toggleCommittee(type, committee)}
    >
      ← Remove
    </button>
  </div>
);

const filteredPanels = availablePanels.filter(
  p =>
    p.committeeName?.toUpperCase() === activeTab
);
  return (
    <div className="assign-page">

      {/* OUTER CARD */}
      <Card className="p-3">
 <div className="mb-3">
        <div className="assign-position-title">Select Position</div>
        <div className="assign-position-muted">
          Choose a requisition and position to assign committees to.
        </div>
      </div>

     
      <Row className="g-3 align-items-end mb-4">
        <Col md={4}>
          <label className="form-label">Requisition</label>
         <select
            className="form-select"
            value={selectedRequisition}
            onChange={handleRequisitionChange}
          >
            <option value="">Select Requisition</option>

            {requisitions.map(req => (
              <option
                key={req.id}
                value={req.id}
              >
                {req.requisitionCode}
              </option>
            ))}
          </select>
        </Col>

        <Col>
          <label className="form-label">Position</label>
          <select
              className="form-select"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              disabled={!selectedRequisition}
            >
              <option value="">Select Position</option>

              {positions.map(pos => (
               <option
                  key={pos.jobPositions?.positionId}
                  value={pos.jobPositions?.positionId}
                >
                  {pos.masterPositions?.positionName}
                </option>
              ))}
            </select>

        </Col>

        <Col className="d-flex gap-2">
          <Button variant="primary"  className="assign-btn w-100"   onClick={handleAssignCommittees}>
            <FiPlus className="me-1" />
            Assign Committees
          </Button>
          <Button variant="secondary" className="assign-btn w-100">
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
                    <div className="config-title">Configure Committees</div>
                    <div className="config-subtitle">
                      Assign panels to Product – ONDC
                    </div>
                  </div>

                  {/* <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      Cancel
                    </Button>
                    <Button variant="warning" className="save-configuration-btn" size="sm">
                      Save Configuration
                    </Button>
                  </div> */}
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
            <div className="dual-committee-box new-ui">
              <div className="available-committees blue">
                <div className="available-panel-header-row">
                  Available Screening Panels
                  <span className="count">{filteredPanels.length}</span>
                </div>
                <div className="panel-divider"></div>
                {filteredPanels.map(c =>
                  renderAvailableCommittee(c, activeTab)
                )}
              </div>

              <div className="swap-icon">⇄</div>

              <div className="selected-committees orange">
                <div className="selected-panel-header-row">
                  Selected Screening Panels
                  <span className="count">{selectedCommittees[activeTab].length}</span>
                </div>
               <div className="panel-divider"></div>
                {selectedCommittees[activeTab].length > 0 ? (
                  selectedCommittees[activeTab].map(c =>
                    renderSelectedCommittee(c, activeTab)
                  )
                ) : (
                  <div className="empty-state">No panels selected</div>
                )}
              </div>
            </div>

          </Card.Body>
        </Card>
      {/* <Card>
        <Card.Body>
         
          {showHistory && <CommitteeHistoryList />}
        
        </Card.Body>
      </Card> */}
      </Card>
    </div>
  );
};

export default AssignPositionsPage;
