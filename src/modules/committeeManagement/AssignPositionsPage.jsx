import React, { useState } from "react";

import "../../style/css/Committee.css";
import CommitteeHistoryList from './components/CommitteeHistoryList';
import { useAssignPositions } from "./hooks/useAssignPositions";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ErrorModal from "./components/ErrorModal";
import Select from "react-select";



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
    handleAssignCommittees,
    panelErrors,
    setPanelErrors,
     showErrorModal,
    setShowErrorModal,
    errorMessage,
    setErrorMessage

  } = useAssignPositions();

  const selectedPositionTitle =
    positions.find(
      p => p.jobPositions?.positionId === selectedPosition
    )?.masterPositions?.positionName || "";


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
        <div className="committee-title" style={{width: "350px"}} >{committee.name}</div>
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
  const renderSelectedCommittee = (committee, type) => {
    const errorKey = `${type}_${committee.id}`;
    const errors = panelErrors?.[errorKey] || {};

    return (
      <div className="committee-row selected" key={committee.id}>
        <div>
          <div className="committee-title" style={{width: "350px"}}>{committee.name}</div>

          <div className="committee-chips">
            {committee.members.map(m => (
              <span key={m.name} className="chip">{m.name}</span>
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
              {errors.startDate && (
                <div className="field-error">{errors.startDate}</div>
              )}
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
              {errors.endDate && (
                <div className="field-error">{errors.endDate}</div>
              )}
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
  };


  const filteredPanels = availablePanels.filter(
    p =>
      p.committeeName?.toUpperCase() === activeTab
  );

  const selectedRequisitionObj = requisitions.find(
  r => r.id === selectedRequisition
);

const normalizedRequisition = {
  ...selectedRequisitionObj,
  registration_start_date: selectedRequisitionObj?.startDate,
  registration_end_date: selectedRequisitionObj?.endDate,
};

console.log("selectedRequisitionObj", selectedRequisitionObj);

const selectedPositionObj = positions.find(
  p => p.jobPositions?.positionId === selectedPosition
)?.jobPositions;

console.log("selectedPositionObj", selectedPositionObj);


const selectedPositionFull = positions.find(
  p => p.jobPositions?.positionId === selectedPosition
);
const normalizedPosition = {
  ...selectedPositionObj,
  positionName: selectedPositionFull?.masterPositions?.positionName
};
  const requisitionOptions = requisitions.map(req => ({
  value: req.id,
  label: `${req.requisitionCode} - ${req.requisitionTitle}`
}));
 
const positionOptions = positions.map(pos => ({
  value: pos.jobPositions?.positionId,
  label: pos.masterPositions?.positionName
}));
  return (
    <div className="assign-positions-page">
      {/* ===== PAGE HEADER ===== */}
    
   

      {/* ===== SELECTION CONTROLS ===== */}
      <div className="selection-section">
        <div class="mb-3"><div class="assign-position-title">Select Position</div><div class="assign-position-muted">Choose a requisition and position to assign committees to.</div></div>
        <div className="selection-grid">
 
          {/* Requisition */}
          <div className="form-group">
            <label className="form-label">Requisition</label>
            <Select
              placeholder="Select Requisition"
              options={requisitionOptions}
              value={
                requisitionOptions.find(
                  option => option.value === selectedRequisition
                ) || null
              }
              onChange={(selectedOption) =>
                handleRequisitionChange({
                  target: { value: selectedOption?.value || "" }
                })
              }
              classNamePrefix="custom-select"
            />
          </div>
 
          {/* Position */}
          <div className="form-group">
            <label className="form-label">Position</label>
            <Select
              placeholder="Select Position"
              options={positionOptions}
              value={
                positionOptions.find(
                  option => option.value === selectedPosition
                ) || null
              }
              onChange={(selectedOption) =>
                setSelectedPosition(selectedOption?.value || "")
              }
              isDisabled={!selectedRequisition}
              classNamePrefix="custom-select"
            />
          </div>
 
        </div>

        {/* ===== REQUISITION STRIP ===== */}
      {selectedRequisition && selectedPosition && (
        <div className="requisition-strip-section">
          <RequisitionStrip
             requisition={normalizedRequisition}
              position={normalizedPosition}
              isCardBg={false}
              isSaveEnabled={false}
          />
        </div>
      )}
      </div>

      

      {/* ===== COMMITTEE CONFIGURATION ===== */}
      <div className="committee-config-section">
        <div className="config-header">
          <div className="config-title-section">
            <h2 className="config-title">Configure Committees</h2>
            <p className="config-subtitle">
              {selectedPositionTitle
                ? `Assign panels to ${selectedPositionTitle}`
                : "Select a position to assign panels"}
            </p>
          </div>
          <button 
            className="assign-button" 
            onClick={handleAssignCommittees}
            disabled={!selectedPosition}
          >
            Assign Committees
          </button>
        </div>

        {/* ===== TABS ===== */}
        <div className="committee-tabs">
          <button
            className={`tab-item ${activeTab === "SCREENING" ? "active" : ""}`}
            onClick={() => setActiveTab("SCREENING")}
          >
            Screening Committee
          </button>
          <button
            className={`tab-item ${activeTab === "INTERVIEW" ? "active" : ""}`}
            onClick={() => setActiveTab("INTERVIEW")}
          >
            Interview Committee
          </button>
          <button
            className={`tab-item ${activeTab === "COMPENSATION" ? "active" : ""}`}
            onClick={() => setActiveTab("COMPENSATION")}
          >
            Compensation Committee
          </button>
        </div>

        {/* ===== DUAL PANELS ===== */}
        <div className="panels-container">
          {/* Available Panels */}
          <div className="panel-box available">
            <div className="panel-header">
              <h3 className="panel-title">Available Panels</h3>
              <span className="panel-count">{filteredPanels.length}</span>
            </div>
            <div className="panel-divider"></div>
            <div className="assignpanel-content">
              {filteredPanels.map(c => renderAvailableCommittee(c, activeTab))}
            </div>
          </div>

          {/* Swap Icon */}
          <div className="swap-divider">
            <div className="swap-icon">⇄</div>
          </div>

          {/* Selected Panels */}
          <div className="panel-box selected">
            <div className="panel-header">
              <h3 className="panel-title">Selected Panels</h3>
              <span className="panel-count">{selectedCommittees[activeTab].length}</span>
            </div>
            <div className="panel-divider"></div>
            <div className="assignpanel-content">
              {selectedCommittees[activeTab].length > 0 ? (
                selectedCommittees[activeTab].map(c => renderSelectedCommittee(c, activeTab))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">No panels selected</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
  show={showErrorModal}
  message={errorMessage}
  onClose={() => setShowErrorModal(false)}
/>
    </div>
  );
};

export default AssignPositionsPage;
