import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderWithBack from "../../shared/components/HeaderWithBack";

import DropdownStrip from "../candidatePreview/components/DropdownStrip";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";

import InterviewPanelsConfig from "../interviews/components/InterviewPanelsConfig";
import ScheduleReadyBar from "../interviews/components/ScheduleReadyBar";
import InterviewScheduleTable from "../interviews/components/InterviewScheduleTable";
import useInterviewSchedule from "../interviews/hooks/useInterviewSchedule";

import "../../style/css/CandidateScreening.css";

const ScheduleInterviews = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */




  const [panels, setPanels] = useState([]);
  const [startTime, setStartTime] = useState("");

  const { 
        schedule,
    updateRow,
    setSchedule,
    requisitions,
    selectedRequisitionId,
    loadingRequisitions,
    positions,
    selectedPositionId,
    loadingPositions,
    handleRequisitionChange,
    setSelectedPositionId
  } = useInterviewSchedule();

  

  const selectedRequisition =
    requisitions.find(r => r.id === selectedRequisitionId);

  const selectedPosition =
    positions.find(p => p.jobPositions?.positionId === selectedPositionId);

  const isSelectionDone =
    selectedRequisition && selectedPosition;

/* ================= PANEL ACTIONS ================= */

  const handleAddPanel = () => {
    setPanels(prev => [
      ...prev,
      { name: `Panel ${prev.length + 1}` }
    ]);
  };

  const handleImportPanel = () => {
  };

  const handleApplyAll = () => {
  };
  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 py-3 mb-5 pb-5">

      {/* ===== HEADER ===== */}
      <HeaderWithBack
        title="Schedule Interviews"
        subtitle="Scheduling for 03 candidates"
        onBack={() => navigate(-1)}
      />

      {/* ===== DROPDOWN STRIP ===== */}
      <div className="card border-0 mt-3">
        <div className="card-body">
          <div className="row g-3">

            <DropdownStrip
              requisitions={requisitions}
              positions={positions}
              selectedRequisitionId={selectedRequisitionId}
              selectedPositionId={selectedPositionId}
              loadingRequisitions={!requisitions.length}
              loadingPositions={!positions.length}
              onRequisitionChange={handleRequisitionChange}
              onRequisitionSearch={() => {}}
              onPositionChange={setSelectedPositionId}
            />

          </div>
        </div>
      </div>

      {/* ===== REQUISITION STRIP ===== */}
      {isSelectionDone && (
        <div className="mt-3">
          <RequisitionStrip
            requisition={selectedRequisition}
            position={{
              positionId: selectedPositionId,
              positionName:
                selectedPosition?.masterPositions?.positionName
            }}
            isCardBg={false}
            isSaveEnabled={false}
          />
        </div>
      )}

      {/* ===== PANELS CONFIG ===== */}
      <InterviewPanelsConfig
        panels={panels}
        startTime={startTime}
        onStartTimeChange={setStartTime}
        onAddPanel={handleAddPanel}
        onImportPanel={handleImportPanel}
        onApplyAll={handleApplyAll}
      />

      {/* ===== READY BAR ===== */}
      <div className="mt-3">
        {/* <ScheduleReadyBar
          count={schedule.length}
          onCancel={() => navigate(-1)}
        /> */}
      </div>

      {/* ===== INTERVIEW SCHEDULE TABLE ===== */}
 <InterviewScheduleTable rows={schedule} /> 

    </div>
  );
};

export default ScheduleInterviews;
