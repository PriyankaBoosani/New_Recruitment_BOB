import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";
import masterApiService from "../jobPosting/services/masterApiService";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";
import jobPositionApiService from "../jobPosting/services/jobPositionApiService";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderWithBack from "../../../src/shared/components/HeaderWithBack";
 
const CandidatePreviewPage = ({ onHide }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const candidateId = state?.candidate?.candidateId;
  const positionId = state?.positionId;
  const applicationId = state?.candidate?.id;

  const [masters, setMasters] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [position, setPosition] = useState(null);

  /* ================= LOAD MASTER + CANDIDATE ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("API 1 → Master");
  
        const masterRes = await masterApiService.getAllMasters();
        const raw = masterRes?.data || {};
  
        const normalizedMasters = {
          genders: raw.genderMasters || [],
          religions: raw.religionMaster || [],
          marital_statuses: raw.maritalStatusMaster || [],
          reservation_categories: raw.reservationCategories || [],
          education_levels: raw.educationLevels || [],
          mandatory_qualifications: raw.mandatoryQualification || [],
          specializations: raw.specializationMaster || [],
          countries: raw.countries || [],
        };
  
        setMasters(normalizedMasters);
  
        console.log("API 2 → Candidate");
  
        const candidateRes =
          await candidateWorkflowServices.getCandidateAllDetails(
            candidateId,
            positionId
          );
  
        const mapped = mapCandidateToPreview(
          candidateRes.data,
          normalizedMasters
        );
  
        setPreviewData(mapped);
  
      } catch (error) {
        console.error("Preview page load failed", error);
      }
    };
  
    fetchData();
  }, [candidateId, positionId]);

  /* ================= RENDER ================= */
  return (
    <div className="bob-preview-page container-fluid p-4">
      
        <>
          <button
            type="button"
            className="btn-close position-absolute"
            style={{ top: "6px", right: "15px", zIndex: 1 }}
            onClick={onHide}
            aria-label="Close"
          />

          <HeaderWithBack
            title="Candidate Screening"
            subtitle="Manage and schedule interviews for candidates"
          />

          {job && position && (
            <RequisitionStrip
              job={job}
              position={position}
              isCardBg
              isSaveEnabled={false}
              masterData={masters}
            />
          )}

          <div className="mt-3">
            <ApplicationForm
              previewData={previewData}
              normalizedMasters={masters}
              candidateId={candidateId}
              positionId={positionId}
              applicationId={applicationId}
            />
          </div>
        </>
      
    </div>
  );
};

 
export default CandidatePreviewPage;
 