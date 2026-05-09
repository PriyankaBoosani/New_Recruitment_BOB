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

  const selectedPosition =
    positions.find(p => p.jobPositions?.positionId === selectedPositionId);

  const isSelectionDone =
    selectedRequisition && selectedPosition;


    const uniqueAllocatedCentres = [
  ...new Map(
    scheduleApiData.map(item => [
      item.interviewCentres.interviewCentreId,
      item.interviewCentres
    ])
  ).values()
];

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
       // startTime={startTime}
       // onStartTimeChange={setStartTime}
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

            onSchedule={() => {

              setShowCentreConfirmModal(true);

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

          // apply mapping
          const updatedSchedule =
            scheduleApiData.map(item => {

              const oldCentreId =
                item.interviewCentres.interviewCentreId;

              const newCentreId =
                centreMappings[oldCentreId];

              return {
                ...item,

                interviewCentres: {
                  ...item.interviewCentres,

                  interviewCentreId: newCentreId
                }
              };

            });

          const res =
            await scheduleInterview(updatedSchedule);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          toast.success(
            "Interviews scheduled successfully"
          );

          setShowCentreModal(false);

          navigate("/candidate-workflow", {
            state: {
              requisitionId: selectedRequisitionId,
              positionId: selectedPositionId
            }
          });

        }}
      />}

<InterviewCentreConfirmModal
  show={showCentreConfirmModal}

  onReview={() => {

    setShowCentreConfirmModal(false);

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

  onProceed={async () => {

    // const res =
    //   await scheduleInterview();

    // if (!res.success) {
    //   toast.error(res.message);
    //   return;
    // }

    // toast.success(
    //   "Interviews scheduled successfully"
    // );

    // setShowCentreConfirmModal(false);

    // setShowReadyBar(false);

    // navigate("/candidate-workflow", {
    //   state: {
    //     requisitionId:
    //       selectedRequisitionId,
    //     positionId:
    //       selectedPositionId
    //   }
    // });

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
