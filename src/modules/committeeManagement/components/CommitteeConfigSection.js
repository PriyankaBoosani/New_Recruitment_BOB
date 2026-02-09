import React from "react";
import AvailablePanelsBox from "./AvailablePanelsBox";
import SelectedPanelsBox from "./SelectedPanelsBox";

const CommitteeConfigSection = ({
  positions,
  selectedPosition,
  handleAssignCommittees,
  activeTab,
  setActiveTab,
  availablePanels,
  selectedCommittees,
  toggleCommittee,
  updateCommitteeDate,
  panelErrors
}) => {

  const selectedPositionTitle =
    positions.find(
      p => p.jobPositions?.positionId === selectedPosition
    )?.masterPositions?.positionName || "";

  const filteredPanels = availablePanels.filter(
    p => p.committeeName?.toUpperCase() === activeTab
  );

  return (
    <div className="committee-config-section">

      {/* Header SAME */}
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

      {/* Tabs SAME */}
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

      {/* Dual Panels SAME */}
      <div className="panels-container">

        <AvailablePanelsBox
          panels={filteredPanels}
          activeTab={activeTab}
          toggleCommittee={toggleCommittee}
        />

        <div className="swap-divider">
          <div className="swap-icon">⇄</div>
        </div>

        <SelectedPanelsBox
          panels={selectedCommittees[activeTab]}
          activeTab={activeTab}
          toggleCommittee={toggleCommittee}
          updateCommitteeDate={updateCommitteeDate}
          panelErrors={panelErrors}
        />

      </div>
    </div>
  );
};

export default CommitteeConfigSection;
