import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderWithBack from "../../shared/components/HeaderWithBack";

import DropdownStrip from "../candidatePreview/components/DropdownStrip";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";

import InterviewPanelsConfig from "../interviews/components/InterviewPanelsConfig";
import InterviewScheduleTable from "../interviews/components/InterviewScheduleTable";
import useInterviewSchedule from "../interviews/hooks/useInterviewSchedule";
import ScheduleReadyBar from "../interviews/components/ScheduleReadyBar";
import RequisitionStripformultiplepositions
from "../candidatePreview/components/RequisitionStripformultiplepositions";
import DropdownStripMultipleposition
from "../candidatePreview/components/DropdownStripMultipleposition";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

import "../../style/css/CandidateScreening.css";
import InterviewCentreAllocationModal from "../interviews/components/InterviewCentreAllocationModal";
import InterviewCentreConfirmModal from "../interviews/components/InterviewCentreConfirmModal";
const ScheduleInterviews = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */


  //const [startTime, setStartTime] = useState("");
const [scheduledCount, setScheduledCount] = useState(0);
  const [showReadyBar, setShowReadyBar] = useState(false);
  //availability of centres
  const [showCentreModal, setShowCentreModal] = useState(false);

  const [showCentreConfirmModal, setShowCentreConfirmModal] =
  useState(false);
  const [pendingApplyData, setPendingApplyData] =
  useState(null);

const [centreMappings, setCentreMappings] = useState({});
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
    scheduleInterview,
    allInterviewCentres 
  } = useInterviewSchedule();
console.log("ScheduleInterviews - selectedPositionId:", selectedPositionId)
  
console.log("All interviews centres:", allInterviewCentres)
  const selectedRequisition =
    requisitions.find(r => r.id === selectedRequisitionId);

    const normalizedRequisition = selectedRequisition
  ? {
      requisition_id: selectedRequisition.id,
      requisition_code: selectedRequisition.requisitionCode,
      requisition_title: selectedRequisition.requisitionTitle,
      registration_start_date: selectedRequisition.startDate,
      registration_end_date: selectedRequisition.endDate,
    }
  : null;

  // const selectedPosition =
  //   positions.find(p => p.jobPositions?.positionId === selectedPositionId);

const location = useLocation();
const state = location.state || {}; 

const selectedPosition = positions.filter(p =>
  selectedPositionId?.includes(
    p.jobPositions?.positionId
  )
);

  const isSelectionDone =
    selectedRequisition && selectedPosition;

const uniqueAllocatedCentres = [
  ...new Map(
    passedCandidates.map(candidate => [
      candidate.interviewCenterId,
      {
        interviewCentreId: candidate.interviewCenterId,
        interviewCentre: candidate.interviewCenterName
      }
    ])
  ).values()
];

  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 py-3 mb-5 pb-5">

      {/* ===== HEADER ===== */}
      {/* <HeaderWithBack
        title="Schedule Interviews"
        subtitle="Scheduling for 03 candidates"
        onBack={() => navigate(-1)}
      /> */}

<HeaderWithBack
  title="Schedule Interviews"
  subtitle={`Scheduling for ${state?.candidates?.length || 0} candidates`}

  // 🔥 ADD THESE
  requisitionId={state.requisitionId}

  positionId={
    Array.isArray(state.positionId)
      ? state.positionId[0]
      : state.positionId
  }

  activeTab="CANDIDATE_POOL"

  onBack={() => {

    console.log("🔙 ScheduleInterviews Back Navigation");

    navigate("/candidate-workflow", {
      state: {
        requisitionId: state.requisitionId,

        // 🔥 IMPORTANT
        positionIds:
          Array.isArray(state.positionId)
            ? state.positionId
            : [state.positionId],

        requisition: state.requisition,
        position: state.position,

        page: state.page,
        pageSize: state.pageSize,
        filters: state.filters,

        activeTab: "CANDIDATE_POOL"
      }
    });
  }}
/>
      {/* ===== DROPDOWN STRIP ===== */}
      <div className="card border-0 mt-3">
        <div className="card-body">
          <div className="row g-3">

            {/* <DropdownStrip
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
            /> */}






<DropdownStripMultipleposition
  requisitions={requisitions}
  positions={positions}
  selectedRequisitionId={selectedRequisitionId}
  selectedPositionId={selectedPositionId}
  loadingRequisitions={loadingRequisitions}
  loadingPositions={loadingPositions}
  onRequisitionChange={handleRequisitionChange}
  onPositionChange={setSelectedPositionId}
  onRequisitionSearch={() => {}}
  disableRequisition={true}
  disablePosition={true}
/>
          </div>
        </div>
      </div>

      {/* ===== REQUISITION STRIP ===== */}
      {isSelectionDone && (
        <div className="mt-3">
          <RequisitionStripformultiplepositions
    requisition={normalizedRequisition}
  position={selectedPosition.map(p => ({
    positionId: p.jobPositions?.positionId,
    positionName:
      p.masterPositions?.positionName
  }))}
  isCardBg={false}
  isSaveEnabled={false}
  isSaveBtn={false}
  saveButton={false}
/>
          {/* <RequisitionStrip
            requisition={selectedRequisition}
            position={{
              positionId: selectedPositionId,
              positionName:
                selectedPosition?.masterPositions?.positionName
            }}
            isCardBg={false}
            isSaveEnabled={false}
          /> */}
        </div>
      )}

      {/* ===== PANELS CONFIG ===== */}
      <InterviewPanelsConfig
         positionId={selectedPositionId}
       // startTime={startTime}
       // onStartTimeChange={setStartTime}
          candidates={passedCandidates}              // ✅ ADD
          onScheduleReady={(rows) => {
              setSchedule(rows);
              setScheduledCount(rows.length);
           //   setShowReadyBar(true);   // ✅ trigger here
            }} // ✅ ADD
            onApplyAll={(data) => {

            setPendingApplyData(data);

            setShowCentreConfirmModal(true);

          }}
      />

      {showReadyBar && (
        <div className="mt-3">
          <ScheduleReadyBar
            count={scheduledCount}
            onCancel={() => setShowReadyBar(false)}
            // onSchedule={async () => {
            //   const res = await scheduleInterview();

            //   if (!res.success) {
            //     toast.error(res.message);
            //     return;
            //   }

            //   toast.success("Interviews scheduled successfully");
            //   setShowReadyBar(false);

            //     // Redirect HERE
            //   navigate("/candidate-workflow", {
            //     state: {
            //       //activeTab: "INTERVIEW_POOL",   
            //       requisitionId: selectedRequisitionId,
            //       positionId: selectedPositionId
            //     }
            //   });
            // }}

            onSchedule={async () => {

                const res = await scheduleInterview();

                if (!res.success) {
                  toast.error(res.message);
                  return;
                }

                toast.success(
                  "Interviews scheduled successfully"
                );

                setShowReadyBar(false);

                navigate("/candidate-workflow", {
                  state: {
                    requisitionId: selectedRequisitionId,
                    positionId: selectedPositionId
                  }
                });

              }}
          />
        </div>
      )}

      {/* ===== INTERVIEW SCHEDULE TABLE ===== */}
      <InterviewScheduleTable rows={schedule}/> 


      {showCentreModal && <InterviewCentreAllocationModal
        show={showCentreModal}
        onClose={() => setShowCentreModal(false)}
        uniqueAllocatedCentres={uniqueAllocatedCentres}
        centreMappings={centreMappings}
        setCentreMappings={setCentreMappings}
        allInterviewCentres={allInterviewCentres}
        onContinue={async () => {

  setShowCentreModal(false);

  // 🔥 Build zonalChangeMap
  const zonalChangeMap = {};

Object.entries(centreMappings).forEach(
  ([oldCentreId, newCentreId]) => {

    zonalChangeMap[oldCentreId] =
      oldCentreId === newCentreId
        ? ""
        : newCentreId;

  }
);

  // 🔥 Call scheduling API
  const res = await applySchedule({
    ...pendingApplyData,

    zonalChangeMap
  });

  if (!res.success) {
    toast.error(res.message);
    return;
  }

  setSchedule(res.rows);

  setScheduledCount(res.rows.length);

  setShowReadyBar(true);

}}
      />}

<InterviewCentreConfirmModal
  show={showCentreConfirmModal}

 onReview={() => {

  setShowCentreConfirmModal(false);

  // 🔥 initialize mappings
  const mappings = {};

  uniqueAllocatedCentres.forEach(centre => {

    mappings[centre.interviewCentreId] =
      centre.interviewCentreId;

  });

  console.log("DEFAULT MAPPINGS", mappings);

  setCentreMappings(mappings);

  setShowCentreModal(true);

}}

  onProceed={async () => {

  setShowCentreConfirmModal(false);

  // 🔥 Build empty zonal map
  const zonalChangeMap = {};

  uniqueAllocatedCentres.forEach((centre) => {

    zonalChangeMap[
      centre.interviewCentreId
    ] = "";

  });

  console.log(
    "PROCEED zonalChangeMap",
    zonalChangeMap
  );

  const res = await applySchedule({
    ...pendingApplyData,
    zonalChangeMap
  });

  if (!res.success) {
    toast.error(res.message);
    return;
  }

  setShowReadyBar(true);

}}
/>
{/* {showCentreConfirmModal && (

  <div className="ipc-alert-overlay">

    <div className="ipc-alert-modal">

      <div className="ipc-alert-icon">
        <i className="bi bi-building-check"></i>
      </div>

      <h4 className="ipc-alert-title">
        Confirm Interview Centre Availability
      </h4>

      <p className="ipc-alert-message">
        Please confirm that all allocated interview
        centres are available for the scheduled
        interview slots.
      </p>

      <p className="ipc-alert-message mt-3">
        If any centre is unavailable, you can review
        and update the interview centre allocation
        before proceeding.
      </p>

      <div className="d-flex justify-content-end gap-2 mt-4">

        
        <button
          className="btn btn-light"
          onClick={() => {

            setShowCentreConfirmModal(false);

            // build mappings
            const mappings = {};

            scheduleApiData.forEach(item => {

              const centre =
                item.interviewCentres;

              mappings[centre.interviewCentreId] =
                centre.interviewCentreId;

            });

            setCentreMappings(mappings);

            setShowCentreModal(true);

          }}
        >
          Review Centres
        </button>

        
        <button
          className="btn btn-primary"
          onClick={async () => {

            const res =
              await scheduleInterview();

            if (!res.success) {
              toast.error(res.message);
              return;
            }

            toast.success(
              "Interviews scheduled successfully"
            );

            setShowCentreConfirmModal(false);

            setShowReadyBar(false);

            navigate("/candidate-workflow", {
              state: {
                requisitionId:
                  selectedRequisitionId,
                positionId:
                  selectedPositionId
              }
            });

          }}
        >
          Proceed
        </button>

      </div>

    </div>

  </div>

)} */}

    </div>
  );
};

export default ScheduleInterviews;
