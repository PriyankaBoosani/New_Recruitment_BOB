// src/modules/candidatePreview/candidatePreviewPage.jsx
 
import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";
 
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";
 
import masterApiService from "../jobPosting/services/masterApiService";
 
 
 
 
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";
import { useSelector } from "react-redux";
 
const CandidatePreviewPage = ({
  onHide,
  selectedJob,
  formErrors,
  setFormErrors,
}) => {
 
const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // 🔹 master data from redux
  const masters = useSelector((state) => state.master);
 
  // 🔹 TEMP ids (replace with route params later)
  const candidateId = "75ddc495-a378-4a1c-8240-7bd6509c9965";
  const applicationId = "aed76e48-03eb-4755-b44e-3e7c1185d85a";
 
  
  const [masterData, setMasterData] = useState(null);
  const [loadingMasters, setLoadingMasters] = useState(false);
 
  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    const loadMasters = async () => {
      setLoadingMasters(true);
      try {
       const res = await masterApiService.getAllMasters();
console.log(" MASTER API RESPONSE:", res.data);
setMasterData(res.data);
 
      } catch (err) {
        console.error(" Failed to load master data", err);
      } finally {
        setLoadingMasters(false);
      }
    };
 
    loadMasters();
  }, []);
 
 
 
 
 
 
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
 
        const res =
          await candidateWorkflowServices.getCandidateAllDetails(
            candidateId,
            applicationId
          );
 
        if (res.success) {
          const mappedData = mapCandidateToPreview(
            res.data,
            masters
          );
          setPreviewData(mappedData);
        }
      } catch (error) {
        console.error("Failed to load candidate preview", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchCandidateDetails();
  }, [candidateId, applicationId, masters]);
 
 
 
  // if (loading) {
  //   return (
  //     <div className="text-center p-4">
  //       Loading candidate details…
  //     </div>
  //   );
  // }
 
 
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
 
      {/* ================= REQUISITION STRIP ================= */}
      <RequisitionStrip
        positionId={selectedJob?.positionId || "f6efff22-4b5e-4d53-8f40-226dd502df3f"}
        masterData={masterData}         
        isCardBg={true}
        isSaveEnabled={false}
        
      />
 
      {/* ================= APPLICATION FORM ================= */}
      <div className="mt-3">
        <ApplicationForm previewData={previewData} />
      </div>
    </div>
  );
};
 
export default CandidatePreviewPage;
 