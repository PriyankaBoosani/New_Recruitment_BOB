import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderWithBack from "../../shared/components/HeaderWithBack";

import DropdownStrip from "../candidatePreview/components/DropdownStrip";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";

import InterviewPanelsConfig from "../interviews/components/InterviewPanelsConfig";
import InterviewScheduleTable from "../interviews/components/InterviewScheduleTable";
import useInterviewSchedule from "../interviews/hooks/useInterviewSchedule";
import ScheduleReadyBar from "../interviews/components/ScheduleReadyBar";
import { toast } from "react-toastify";

import "../../style/css/CandidateScreening.css";

const ScheduleInterviews = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */


  const [startTime, setStartTime] = useState("");
const [scheduledCount, setScheduledCount] = useState(0);
  const [showReadyBar, setShowReadyBar] = useState(false);
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
    setSelectedPositionId,
    passedCandidates,
    applySchedule,
    scheduleApiData,
    scheduleInterview   
  } = useInterviewSchedule();
console.log("ScheduleInterviews - selectedPositionId:", selectedPositionId)
  

  const selectedRequisition =
    requisitions.find(r => r.id === selectedRequisitionId);

  const selectedPosition =
    positions.find(p => p.jobPositions?.positionId === selectedPositionId);

  const isSelectionDone =
    selectedRequisition && selectedPosition;

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
              disableRequisition={true}
              disablePosition={true}
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
         positionId={selectedPositionId}
        startTime={startTime}
        onStartTimeChange={setStartTime}
          candidates={passedCandidates}              // ✅ ADD
 onScheduleReady={(rows) => {
    setSchedule(rows);
    setScheduledCount(rows.length);
    setShowReadyBar(true);   // ✅ trigger here
  }} // ✅ ADD
   onApplyAll={applySchedule}
      />

      {showReadyBar && (
        <div className="mt-3">
          <ScheduleReadyBar
            count={scheduledCount}
            onCancel={() => setShowReadyBar(false)}
            onSchedule={async () => {
              const res = await scheduleInterview();

              if (!res.success) {
                toast.error(res.message);
                return;
              }

              toast.success("Interviews scheduled successfully");
              setShowReadyBar(false);
            }}
          />
        </div>
      )}

      {/* ===== INTERVIEW SCHEDULE TABLE ===== */}
      <InterviewScheduleTable rows={schedule}/> 

    </div>
  );
};

export default ScheduleInterviews;
