import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderWithBack from "../../shared/components/HeaderWithBack";

import InterviewPanelsConfig from "../interviews/components/InterviewPanelsConfig";
import InterviewScheduleTable from "../interviews/components/InterviewScheduleTable";
import useInterviewSchedule from "../interviews/hooks/useInterviewSchedule";
import ScheduleReadyBar from "../interviews/components/ScheduleReadyBar";
import RequisitionStripformultiplepositions from "../candidatePreview/components/RequisitionStripformultiplepositions";
import DropdownStripMultipleposition from "../candidatePreview/components/DropdownStripMultipleposition";
import { toast } from "react-toastify";

import "../../style/css/CandidateScreening.css";
import InterviewCentreAllocationModal from "../interviews/components/InterviewCentreAllocationModal";
import InterviewCentreConfirmModal from "../interviews/components/InterviewCentreConfirmModal";
import ScheduleErrorModal from "../interviews/components/ScheduleErrorModal";
import { Modal } from "react-bootstrap";
import interviewService from "./services/interviewService";
const ScheduleInterviews = () => {
  const navigate = useNavigate();

  const [scheduledCount, setScheduledCount] = useState(0);
  const [showReadyBar, setShowReadyBar] = useState(false);
  const [showCentreModal, setShowCentreModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorCandidates, setErrorCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCentreConfirmModal, setShowCentreConfirmModal] = useState(false);
  const [pendingApplyData, setPendingApplyData] = useState(null);
  const [candidateJobPage, setCandidateJobPage] = useState(0);
  const [candidateJobPageSize, setCandidateJobPageSize] = useState(10);
  const [candidateJobTotalElements, setCandidateJobTotalElements] = useState(0);
  const [allocationRefreshKey, setAllocationRefreshKey] = useState(0);

  const [centreRows, setCentreRows] = useState([
    {
      allocatedCentreId: "",
      replacedCentreId: "",
    },
  ]);

  const location = useLocation();
  const state = location.state || {};
  const jobDetails = state.jobDetails;
  const isSchedulingOngoing =
    !!jobDetails && (state.status === "ACTIVE" || state.status === "COMPLETED");
  const isCompleted = state.status === "COMPLETED";
  const isEditMode = location.state?.isEditMode;
  const isReschedule = location.state?.isReschedule;
  const isCandidateDetailsPaginated =
    isSchedulingOngoing || isCompleted || allocationRefreshKey > 0;
  const {
    schedule,
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
    scheduleInterview,
    allInterviewCentres,
  } = useInterviewSchedule(isEditMode, isReschedule);

  const selectedRequisition = requisitions.find(
    (r) => r.id === selectedRequisitionId
  );
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSchedulingProgress, setShowSchedulingProgress] = useState(false);
  const normalizedRequisition = selectedRequisition
    ? {
        requisition_id: selectedRequisition.id,
        requisition_code: selectedRequisition.requisitionCode,
        requisition_title: selectedRequisition.requisitionTitle,
        registration_start_date: selectedRequisition.startDate,
        registration_end_date: selectedRequisition.endDate,
      }
    : null;

  //from schedule pool

  const schedulePoolData = location.state?.schedulePoolData;
  useEffect(() => {
    // Scheduling job is still running
    if (state.status === "ACTIVE") {
      setIsScheduling(true);
    }

    // Scheduling Ongoing → show Submit / Cancel
    if (isSchedulingOngoing && state.status === "COMPLETED") {
      setShowReadyBar(true);
    }
  }, [state.status, isSchedulingOngoing]);

  useEffect(() => {
    if (!isEditMode || !schedulePoolData?.length) {
      return;
    }

    const mappedRows = schedulePoolData.map((item) => ({
      id: item.id,

      // ✅ IMPORTANT FOR RESCHEDULE
      applicationId: item.applicationId,

      interviewCenterId: item.interviewCenterId,

      panelId: item.panelId,

      duration: item.duration,

      perDay: item.perDay,

      startTime: item.startTime,

      endTime: item.endTime,

      rawDate: item.rawDate,

      // TABLE DATA
      name: item.name,

      regNo: item.regNo,

      date: item.date,

      time: item.time,

      zone: item.zone,

      panel: item.panel,
      positionId: item.positionId,
    }));

    setSchedule(mappedRows);

    setScheduledCount(mappedRows.length);

    //setShowReadyBar(true);
  }, [isEditMode, schedulePoolData]);

  const loadCandidateJobDetails = useCallback(
    async (page = candidateJobPage, pageSize = candidateJobPageSize) => {
      const positionId = state.positionId;

      if (!positionId) return;

      try {
        const response = await interviewService.getInterviewCandidateJobDetails(
          {
            positionId: Array.isArray(positionId) ? positionId : [positionId],
            page,
            size: pageSize,
          }
        );

        const data = response?.data;

        // ONLY job/details response
        const content = data?.content || [];

        // Pagination comes ONLY from job/details
        const pageInfo = data?.page;

        setCandidateJobTotalElements(pageInfo?.totalElements || 0);

        const mappedRows = content.map((item) => {
          const staging = item?.interviewScheduleStaging;
          const application = staging?.application;

          const start = staging?.interviewStartAt;
          const end = staging?.interviewEndAt;

          const startTime = start?.split("T")[1]?.slice(0, 5) || "";

          const endTime = end?.split("T")[1]?.slice(0, 5) || "";

          return {
            id: application?.id || item?.applicationId,

            applicationId: application?.id || item?.applicationId,

            positionId: item?.positionId,

            panelId: item?.interviewPanels?.interviewPanelId,

            interviewCenterId: item?.interviewCentres?.interviewCentreId,

            name: item?.fullName || staging?.candidateProfile?.fullName || "-",

            regNo:
              application?.applicationNo ||
              item?.candidateApplications?.applicationNo ||
              "-",

            date: start?.split("T")[0] || "-",

            time: startTime && endTime ? `${startTime} - ${endTime}` : "-",

            zone:
              item?.interviewCentres?.displayName ||
              item?.interviewCentres?.interviewCentre ||
              "-",

            panel: item?.interviewPanels?.panelName || "-",

            rawDate: start?.split("T")[0] || "",

            startTime,
            endTime,
            interviewSchedulingJobStatus:
              item?.interviewSchedulingJobStatus || "-",
            remarks: item?.remarks || "",
          };
        });

        // ONLY job/details data goes into table
        setSchedule(mappedRows);

        // Total also comes from job/details
        setScheduledCount(pageInfo?.totalElements || mappedRows.length);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    },
    [state.positionId, candidateJobPage, candidateJobPageSize, setSchedule]
  );
  useEffect(() => {
    if (state.status !== "COMPLETED" && allocationRefreshKey === 0) {
      return;
    }

    loadCandidateJobDetails(candidateJobPage, candidateJobPageSize);
  }, [
    state.status,
    candidateJobPage,
    candidateJobPageSize,
    allocationRefreshKey,
    loadCandidateJobDetails,
  ]);
  //end

  const selectedPosition = positions.filter((p) =>
    selectedPositionId?.includes(p.jobPositions?.positionId)
  );
  const isSelectionDone = selectedRequisition && selectedPosition.length > 0;
  const sourceCandidates = isEditMode ? schedulePoolData : passedCandidates;
  const uniqueAllocatedCentres = [
    ...new Map(
      sourceCandidates.map((candidate) => [
        isEditMode ? candidate.interviewCenterId : candidate.interviewCenterId,

        {
          interviewCentreId: isEditMode
            ? candidate.interviewCenterId
            : candidate.interviewCenterId,

          interviewCentre: isEditMode
            ? candidate.zone
            : candidate.interviewCenterName,
        },
      ])
    ).values(),
  ];

  const panelNameMap = {};

  (schedulePoolData || []).forEach((item) => {
    if (item?.panelId && item?.panel) {
      panelNameMap[item.panelId] = item.panel;
    }
  });
  const ongoingSelectedPanels = Object.values(
    (jobDetails?.panelScheduleModelList || []).reduce((acc, item) => {
      const panelId = item?.panelId;

      if (!panelId) return acc;

      if (!acc[panelId]) {
        acc[panelId] = {
          id: panelId,
          name: "",
          slots: [],
        };
      }

      acc[panelId].slots.push({
        date: item.panelDate,
        startTime: item.startTime?.slice(0, 5) || "",
        endTime: item.endTime?.slice(0, 5) || "",
        duration: String(item.durationInMinutes || 15),
        perDay: String(item.interviewPerDay || 1),
      });

      return acc;
    }, {})
  );
  const rebuiltSelectedPanels = Object.values(
    (schedulePoolData || []).reduce((acc, item) => {
      const configurations = item.panelScheduleConfigurations || [];

      configurations.forEach((config) => {
        const panelId = config?.panelId;

        if (!panelId) return;

        const panelName = panelNameMap[panelId] || "";

        // ✅ create panel group
        if (!acc[panelId]) {
          acc[panelId] = {
            id: panelId,

            name: panelName,

            slots: [],
          };
        }

        const slotDate = config?.startDatetime?.split("T")[0];

        if (!slotDate) return;

        const startTime =
          config?.startDatetime?.split("T")[1]?.slice(0, 5) || "";

        const endTime = config?.endDatetime?.split("T")[1]?.slice(0, 5) || "";

        const duration = String(config?.durationMinutes || 15);

        // ✅ SAME PANEL + SAME DATE
        const existingSlot = acc[panelId].slots.find(
          (slot) => slot.date === slotDate
        );

        // ================= MERGE =================

        if (existingSlot) {
          // earliest start
          if (startTime && startTime < existingSlot.startTime) {
            existingSlot.startTime = startTime;
          }

          // latest end
          if (endTime && endTime > existingSlot.endTime) {
            existingSlot.endTime = endTime;
          }

          // ✅ recalculate perDay
          const start = new Date(`2000-01-01T${existingSlot.startTime}`);

          const end = new Date(`2000-01-01T${existingSlot.endTime}`);

          const diffMins = (end - start) / (1000 * 60);

          existingSlot.perDay = String(
            Math.floor(diffMins / Number(existingSlot.duration || 15))
          );
        }

        // ================= NEW SLOT =================
        else {
          const start = new Date(`2000-01-01T${startTime}`);

          const end = new Date(`2000-01-01T${endTime}`);

          const diffMins = (end - start) / (1000 * 60);

          const perDay = String(Math.floor(diffMins / Number(duration || 15)));

          acc[panelId].slots.push({
            date: slotDate,

            startTime,

            endTime,

            duration,

            perDay,
          });
        }
      });

      return acc;
    }, {})
  );
  /* ================= UI ================= */
  const sourceTab = state?.sourceTab || state?.activeTab || "CANDIDATE_POOL";
  return (
    <div className="container-fluid px-4 py-3 mb-5 pb-5">
      <HeaderWithBack
        title="Schedule Interviews"
        subtitle={`Scheduling for ${
          isEditMode
            ? schedulePoolData?.length || 0
            : passedCandidates?.length || 0
        } candidates`}
        requisitionId={state.requisitionId}
        positionId={
          Array.isArray(state.positionId)
            ? state.positionId[0]
            : state.positionId
        }
        activeTab={sourceTab}
        onBack={() => {
          navigate("/candidate-workflow", {
            state: {
              requisitionId: state.requisitionId,
              positionIds: Array.isArray(state.positionId)
                ? state.positionId
                : [state.positionId],
              requisition: state.requisition,
              position: state.position,
              page: state.page,
              pageSize: state.pageSize,
              filters: state.filters,
              activeTab: sourceTab,
            },
          });
        }}
      />
      {/* ===== DROPDOWN STRIP ===== */}
      <div className="card border-0 mt-3">
        <div className="card-body">
          <div className="row g-3">
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
              isReadonly={true}
            />
          </div>
        </div>
      </div>

      {/* ===== REQUISITION STRIP ===== */}
      {isSelectionDone && (
        <div className="mt-3">
          <RequisitionStripformultiplepositions
            requisition={normalizedRequisition}
            position={selectedPosition.map((p) => ({
              positionId: p.jobPositions?.positionId,
              positionName: p.masterPositions?.positionName,
            }))}
            isCardBg={false}
            isSaveEnabled={false}
            isSaveBtn={false}
            saveButton={false}
            isReadonly={true}
          />
        </div>
      )}

      {/* ===== PANELS CONFIG ===== */}
      <InterviewPanelsConfig
        positionId={selectedPositionId}
        candidates={isEditMode ? schedulePoolData : passedCandidates} // ✅ ADD
        onScheduleReady={(rows) => {
          setSchedule(rows);
          setScheduledCount(rows.length);
          //   setShowReadyBar(true);   // ✅ trigger here
        }} // ✅ ADD
        onApplyAll={(data) => {
          // ===== SCHEDULING ONGOING =====
          if (isSchedulingOngoing) {
            const applicationIds =
              jobDetails?.schedulingPanelModel?.applicationIds || [];

            const ongoingPayload = {
              selectedPanels: data.selectedPanels,

              positionId: Array.isArray(selectedPositionId)
                ? selectedPositionId
                : [selectedPositionId],

              candidates: applicationIds.map((applicationId) => ({
                id: applicationId,
              })),
            };

            setPendingApplyData(ongoingPayload);
          }

          // ===== EDIT MODE =====
          else if (isEditMode) {
            const editPayload = {
              selectedPanels: data.selectedPanels,

              positionId: Array.isArray(selectedPositionId)
                ? selectedPositionId
                : [selectedPositionId],

              candidates: schedule.map((item) => ({
                id: item.applicationId || item.id,
                interviewCenterId: item.interviewCenterId,
              })),
            };

            setPendingApplyData(editPayload);
          }

          // ===== NORMAL FLOW =====
          else {
            setPendingApplyData(data);
          }

          setShowCentreConfirmModal(true);
        }}
        initialSelectedPanels={
          isReschedule
            ? []
            : isSchedulingOngoing
              ? ongoingSelectedPanels
              : rebuiltSelectedPanels
        }
      />

      {showReadyBar && (
        <div className="mt-3">
          <ScheduleReadyBar
            count={scheduledCount}
            isScheduling={isScheduling}
            onCancel={() => setShowReadyBar(false)}
            onSchedule={async () => {
              if (isScheduling) return;

              try {
                setIsScheduling(true);

                const res = await scheduleInterview();

                if (!res?.success) {
                  setErrorMessage(
                    res?.message || "Failed to schedule interviews"
                  );

                  setErrorCandidates(Array.isArray(res?.data) ? res.data : []);

                  setShowErrorModal(true);

                  return;
                }

                toast.success("Interview scheduled successfully");

                navigate("/candidate-workflow", {
                  state: {
                    requisitionId: selectedRequisitionId,
                    positionIds: Array.isArray(selectedPositionId)
                      ? selectedPositionId
                      : [selectedPositionId],
                    activeTab: "SCHEDULE_POOL",
                    refreshSchedulePool: true,
                  },
                });
              } finally {
                setIsScheduling(false);
              }
            }}
          />
        </div>
      )}

      {/* ===== INTERVIEW SCHEDULE TABLE ===== */}
      <InterviewScheduleTable
        rows={schedule}
        positionId={selectedPositionId}
        position={selectedPosition}
        isSchedulingOngoing={isCandidateDetailsPaginated}
        page={candidateJobPage}
        pageSize={candidateJobPageSize}
        totalElements={candidateJobTotalElements}
        onPageChange={setCandidateJobPage}
        onPageSizeChange={(size) => {
          setCandidateJobPageSize(size);
          setCandidateJobPage(0);
        }}
      />

      {showCentreModal && (
        <InterviewCentreAllocationModal
          show={showCentreModal}
          onClose={() => setShowCentreModal(false)}
          uniqueAllocatedCentres={uniqueAllocatedCentres}
          centreRows={centreRows}
          setCentreRows={setCentreRows}
          allInterviewCentres={allInterviewCentres}
          onContinue={async () => {
            setShowCentreModal(false);

            // 🔥 Build zonalChangeMap
            const zonalChangeMap = {};

            // 🔥 first add all centres with empty
            uniqueAllocatedCentres.forEach((centre) => {
              zonalChangeMap[centre.interviewCentreId] = "";
            });

            // 🔥 overwrite changed centres
            centreRows.forEach((row) => {
              if (row.allocatedCentreId && row.replacedCentreId) {
                zonalChangeMap[row.allocatedCentreId] = row.replacedCentreId;
              }
            });

            // 🔥 Call scheduling API
            const res = await applySchedule({
              ...pendingApplyData,

              zonalChangeMap,
            });

            if (!res.success) {
              setErrorMessage(res.message);

              setErrorCandidates(res.data || []);

              setShowErrorModal(true);

              return;
            }

            setSchedule(res.rows);

            setScheduledCount(res.rows.length);

            setShowReadyBar(true);
          }}
        />
      )}

      <InterviewCentreConfirmModal
        show={showCentreConfirmModal}
        onClose={() => setShowCentreConfirmModal(false)}
        onReview={() => {
          setShowCentreConfirmModal(false);

          // ✅ ONLY ONE EMPTY ROW
          setCentreRows([
            {
              allocatedCentreId: "",
              replacedCentreId: "",
            },
          ]);

          setShowCentreModal(true);
        }}
        onProceed={async () => {
          setShowCentreConfirmModal(false);

          const zonalChangeMap = {};

          uniqueAllocatedCentres.forEach((centre) => {
            zonalChangeMap[centre.interviewCentreId] = "";
          });

          setIsScheduling(true);

          try {
            const res = await applySchedule({
              ...pendingApplyData,
              zonalChangeMap,
            });

            setIsScheduling(false);

            // Allocate failed
            if (!res?.success) {
              setErrorMessage(res?.message || "Scheduling failed");
              setErrorCandidates(res?.data || []);
              setShowErrorModal(true);
              return;
            }

            // ==========================================
            // ALLOCATE SUCCESS
            // NOW GET DATA ONLY FROM job/details
            // ==========================================

            setAllocationRefreshKey((currentKey) => currentKey + 1);

            setShowReadyBar(true);
          } catch (error) {
            setIsScheduling(false);

            setErrorMessage("Something went wrong while scheduling");

            setErrorCandidates([]);
            setShowErrorModal(true);
          }
        }}
      />
      <Modal
        show={isScheduling}
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {}}
      >
        <Modal.Body className="text-center p-4">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <h5>Scheduling is in progress</h5>

          <p className="text-muted mb-4">
            Please wait while the candidates are being scheduled.
          </p>

          <button
            type="button"
            className="btn blue-bg text-white px-4"
            onClick={() => {
              setIsScheduling(false);

              navigate("/candidate-workflow", {
                state: {
                  requisitionId: selectedRequisitionId,
                  positionIds: Array.isArray(selectedPositionId)
                    ? selectedPositionId
                    : [selectedPositionId],
                   activeTab: sourceTab,
                },
              });
            }}
          >
            OK
          </button>
        </Modal.Body>
      </Modal>

      <ScheduleErrorModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        errorCandidates={errorCandidates}
      />
    </div>
  );
};

export default ScheduleInterviews;
