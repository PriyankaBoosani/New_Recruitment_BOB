import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";

import masterApiService from "../jobPosting/services/masterApiService";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";

import { useLocation, useNavigate } from "react-router-dom";
import HeaderWithBack from "../../../src/shared/components/HeaderWithBack";

const CandidatePreviewPage = ({ onHide }) => {
  const location = useLocation();
  const navigate = useNavigate();

  /* =======================
     DATA FROM NAVIGATION
  ======================= */
  const state = location.state || {};

  const candidate = state?.candidate;
  const requisition = state?.requisition;
  const position = state?.position;
  const positionId = state?.positionId;

  const candidateId = candidate?.candidateId;
  const applicationId = candidate?.id;

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
        // const masterRes = await masterApiService.getAllMasters();
        // const raw = masterRes?.data || {};

        const masterRes = await masterApiService.getAllMasters();
const fullMasters = masterRes?.data || {};

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
      <HeaderWithBack
        title="Candidate Screening"
        subtitle="Manage and schedule interviews for candidates"
        onBack={() => navigate(-1)}
      />

      {/* Requisition Strip */}
      {requisition && position && (
        <RequisitionStrip
          requisition={requisition}
          position={position}
          isCardBg
          isSaveEnabled={false}
          masterData={masters}
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
            />
          )
        )}
      </div>
    </div>
  );
};

export default CandidatePreviewPage;
