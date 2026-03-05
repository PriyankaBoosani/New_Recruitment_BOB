import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";

import masterApiService from "../master/services/masterApiService";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";

import { useLocation, useNavigate } from "react-router-dom";
import HeaderWithBack from "../../../src/shared/components/HeaderWithBack";
import HeaderWithBacks from "../../../src/shared/components/headerwithbacks";
import HeaderWithBackss from "../../../src/shared/components/headerwithbackss";
import { useSelector } from "react-redux";


const CandidatePreviewPage = ({ onHide }) => {
  const location = useLocation();
  const navigate = useNavigate();

  //  DEFINE STATE FIRST
  const state = location.state || {};
  const activeTab = state?.activeTab;

  const user = useSelector((state) => state.user.user);

  // const role = user?.role?.toLowerCase();
  // const isZonalHr = role === "zonal_hr";
  // const isInterviewer = role === "interviewer";
  //   const isRecruiter = role === "recruiter";




  const privileges = useSelector((state) => state.user.privileges);

const isInterviewer = privileges?.Interview;
const isZonalHr = privileges?.Verification;
const isRecruiter = privileges?.JobPostings; // or whatever recruiter privilege is


  const selectedDate = state?.selectedDate;






  // const privileges = useSelector((state) => state.user.privileges);
    const canJobPost = privileges?.JobPostings;
    const canCandidateWorkflow = privileges?.["Candidate Pool"] || privileges?.["Compensation Pool"];
    const canCommittee = privileges?.["Committee Management"];
    const canVerification = privileges?.Verification;
    const canAdmin = privileges?.Admin;
    const canInterview = privileges?.["Interview"];
    const canApprovals = privileges?.["Requisition Approval"] || privileges?.["Extension Approval"] || privileges?.["Committee Approval"];
    const canViewPosition= privileges?.["View Position"];

  //  Now safe to use state
  const interviewScheduleId = state?.interviewScheduleId;

  const candidate = state?.candidate;
  const requisition = state?.requisition;
  const requisitionTitle = requisition?.requisition_title;
  const positionName = state?.position?.positionName;
  const position = state?.position;

  const candidateId = candidate?.candidateId;
  const positionId = state?.positionId;
  const requisitionId = state?.requisitionId;

  const applicationId =
    isZonalHr
      ? state?.applicationId
      : state?.applicationId ?? state?.candidate?.id;

  // const applicationId = candidate?.id;

  /* =======================
     STATE
  ======================= */
  const [masters, setMasters] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD MASTERS + CANDIDATE
  ======================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        /* ---------- Load Masters ---------- */
        // const masterRes = await masterApiService.getMasterDisplayAll();
        // const raw = masterRes?.data || {};

        const masterRes = await masterApiService.getMasterDisplayAll();
        const fullMasters = masterRes?.data || {};

        const InterviewCenters = await masterApiService.getAllInterviewCenters()
        const  ZonalStats =await masterApiService.getZonalStates()
    

        // const normalizedMasters = {
        //   genders: raw.genderMasters || [],
        //   religions: raw.religionMaster || [],
        //   marital_statuses: raw.maritalStatusMaster || [],
        //   reservation_categories: raw.reservationCategories || [],
        //   education_levels: raw.educationLevels || [],
        //   mandatory_qualifications: raw.mandatoryQualification || [],
        //   specializations: raw.specializationMaster || [],
        //   countries: raw.countries || [],
        // };

        setMasters(fullMasters);
        /* ---------- Load Candidate ---------- */
        if (candidateId && positionId) {
          const candidateRes =
            await candidateWorkflowServices.getCandidateAllDetails(
              candidateId,
              positionId
            );

          // const mapped = mapCandidateToPreview(
          //   candidateRes.data,
          //   normalizedMasters
          // );

          const candidateMasters = {
            genders: fullMasters.genderMasters || [],
            religions: fullMasters.religionMaster || [],
            marital_statuses: fullMasters.maritalStatusMaster || [],
            reservation_categories: fullMasters.reservationCategories || [],
            education_levels: fullMasters.educationLevels || [],
            mandatory_qualifications: fullMasters.mandatoryQualification || [],
            specializations: fullMasters.specializationMaster || [],
            countries: fullMasters.countries || [],
            states: fullMasters.states,
            districts: fullMasters.districts,
            cities: fullMasters.cities,
            pincodes: fullMasters.pincodes,
            interviewCenters: InterviewCenters.data || [],
            zonalStats: ZonalStats.data || []
          };

          const mapped = mapCandidateToPreview(
            candidateRes.data,
            candidateMasters
          );

          setPreviewData(mapped);
        }
      } catch (error) {
        console.error("Candidate preview load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId, positionId]);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="bob-preview-page container-fluid p-4">
      {/* Close Button */}
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: "6px", right: "15px", zIndex: 1 }}
        onClick={onHide || (() => navigate(-1))}
        aria-label="Close"
      />

      {/* Header */}
      {!isZonalHr && !isInterviewer && (
        <HeaderWithBack
          title="Candidate Screening"
          subtitle="Manage and schedule interviews for candidates"
          onBack={() =>
            navigate("/candidate-verification", {
              state: {
                requisition: state.requisition,
                position: state.position,
                preloadedCandidates: state.candidates,
                selectedDate: state.selectedDate
              }
            })
          }

          positionId={positionId}
          requisitionId={requisitionId}
          candidateScreening={true}
          activeTab={activeTab}
        />
      )}
      {isZonalHr && (
        <HeaderWithBacks
          title="Candidate Profile"
          subtitle="View candidate details application status"
          onBack={() => {
            sessionStorage.setItem("fromPreviewBack", "true");

            navigate("/candidate-verification", {
              state: {
                requisition,
                position,
                preloadedCandidates: state.candidates || [],
                selectedDate
              }
            });
          }}
        />
      )}



      {isInterviewer && (
        <HeaderWithBackss
          title="Candidate Profile"
          subtitle="View candidate details application status"
          onBack={() => {
            sessionStorage.setItem("fromPreviewBack", "true");

            navigate("/candidate-interviewer", {
              state: {
                requisition,
                position,
                preloadedCandidates:
                  state.preloadedCandidates || state.candidates || [],
                selectedDate
              }
            });


          }}
        />
      )}


      {/* Requisition Strip */}
      {isZonalHr && requisition && position && (
        <RequisitionStrip
          requisition={requisition}
          position={position}
          isCardBg
          isSaveEnabled={false}
          showSaveButton={true}
          isSaveBtn={false}
        // masterData={masters}
        />
      )}



      {!isZonalHr && requisition && position && (
        <RequisitionStrip
          requisition={requisition}
          position={position}
          isCardBg
          isSaveEnabled={false}
        //  masterData={masters}
        //  masterData={masters}
        />
      )}

      {/* Application Form */}
      <div className="mt-3">
        {loading ? (
          <div className="text-center py-4">Loading candidate details...</div>
        ) : (
          previewData && (
            <ApplicationForm
              previewData={previewData}
              normalizedMasters={masters}
              candidateId={candidateId}
              positionId={positionId}
              applicationId={applicationId}
              requisitionId={requisitionId}
              interviewScheduleId={interviewScheduleId}
              requisitionTitle={requisitionTitle}
              positionName={positionName}
              selectedDate={selectedDate}
              zonalVerificationStatus={candidate?.zonalVerificationStatus}
              zonalSubmitBeforeDate={candidate?.zonalSubmitBeforeDate}
              zonalHrComments={candidate?.zonalHrComments}
              candidateStatus={candidate?.status}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CandidatePreviewPage;
