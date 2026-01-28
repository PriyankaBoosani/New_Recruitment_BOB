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
 
const CandidatePreviewPage = ({
  onHide,
  selectedJob,
  formErrors,
  setFormErrors,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  // console.log("NAV STATE:", state);
  console.log(" CandidatePreviewPage - candidate:", state);
  const [masters, setMasters] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // 🔹 master data from redux
//   const masters = useSelector((state) => state.master);

  // 🔹 TEMP ids (replace with route params later)
  // const candidateId = "75ddc495-a378-4a1c-8240-7bd6509c9965";
  // const applicationId = "aed76e48-03eb-4755-b44e-3e7c1185d85a";

  const candidateId = state?.candidate?.candidateId;
  const applicationId = state?.positionId;;
  // const positionId = state?.positionId;
  const [job, setJob] = useState(null);
  const [position, setPosition] = useState(null);

 
  /* ================= LOAD MASTER DATA ================= */
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
          applicationId
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
}, [candidateId, applicationId]);
 
  return (
    <div className="bob-preview-page container-fluid p-4">
      {/* Close button */}
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
 
      {/* ================= REQUISITION STRIP ================= */}
      {job && position && (
        <RequisitionStrip
          job={job}
          position={position}
          isCardBg={true}
          isSaveEnabled={false}
          masterData={masters}
        />
      )}
 
      {/* ================= APPLICATION FORM ================= */}
      <div className="mt-3">
        <ApplicationForm 
          previewData={previewData} 
          normalizedMasters={masters}
        />
      </div>
    </div>
  );
};
 
export default CandidatePreviewPage;
 