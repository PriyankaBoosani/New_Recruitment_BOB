// src/modules/candidatePreview/components/RequisitionStrip.jsx
 
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import NationalVacancyTable from "./NationalVacancyTable";
import LocationWiseVacancyTable from "./LocationWiseVacancyTable";
 
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import masterApiService from "../../master/services/masterApiService";   // ADDED
import { mapJobPositionToRequisitionStrip } from "../mappers/candidatePreviewMapper";
import { format } from "date-fns";

 
const RequisitionStrip = ({
  requisition,
  position,
  isSaved,
  onSave,
  isCardBg,
  isSaveEnabled,
}) => {
 
  const [showPosition, setShowPosition] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const [masterData, setMasterData] = useState(null);   //  INTERNAL


  const formatDMY = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "dd-MM-yyyy");
  } catch {
    return dateStr;
  }
};

 
  /* ================= LOAD MASTER DATA ================= */
 
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const res = await masterApiService.getMasterDisplayAll();
        setMasterData(res.data || {});
      } catch (err) {
        console.error("Failed to load master data", err);
        setMasterData({});
      }
    };
 
    loadMasters();
  }, []);
 
  /* ================= FETCH JOB ================= */
 
  useEffect(() => {
    if (!position?.positionId || !masterData) return;
 
    const fetchJob = async () => {
      try {
        setLoading(true);
 
        const res =
          await candidateWorkflowServices.getJobPositionById(
            position.positionId
          );
 
        const mapped =
          mapJobPositionToRequisitionStrip(res.data, masterData);
 
        setJob(mapped);
 
      } catch (err) {
        console.error("Failed to fetch job details", err);
        toast.error("Failed to load position details");
      } finally {
        setLoading(false);
      }
    };
 
    fetchJob();
 
  }, [position?.positionId, masterData]);
 
  const handleViewPosition = () => {
    setShowPosition(true);
  };
 
  return (
<>
      {/* ================= STRIP ================= */}
<div
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center px-3 py-2"
        style={{
          background: isCardBg ? "#ffffff" : "none",
          border: isCardBg ? "1px solid #e0e0e0" : "none",
          borderRadius: "8px"
        }}
>
 
        {/* ===== LEFT CONTENT ===== */}
<div className="w-100">
 
          <div className="d-flex flex-column flex-md-row flex-wrap align-items-center gap-2">
 
            <span className="req-code">
              {requisition?.requisition_code || requisition?.requisitionCode || ""}
              {" "}
              {requisition?.requisition_title || requisition?.requisitionTitle || "-"}
</span>
 
            <span className="date-text">
<i className="bi bi-calendar3 me-1"></i>
Start: {formatDMY(requisition?.registration_start_date)}
</span>
 
            <span className="date-divider">|</span>
 
            <span className="date-text">
<i className="bi bi-clock me-1"></i>
End: {formatDMY(requisition?.registration_end_date)}
</span>
 
          </div>
 
          <div
            className="job-title mt-1"
            style={{ color: "#162B75", fontWeight: 500 }}
>
            {position?.positionName || position?.masterPositions?.positionName || "—"}
</div>
 
        </div>
 
        {/* ===== BUTTONS ===== */}
<div className="d-flex flex-row gap-2 mt-2 mt-md-0 ms-md-auto">
 
          <button
            className="btn btn-sm blue-border blue-color px-3"
            onClick={handleViewPosition}
            disabled={loading || !position}
            style={{ backgroundColor: "rgba(66, 87, 159, 0.12)" }}
>
            View Position
</button>
 

  <button
    className={`save-btn ${isSaveEnabled ? "unsaved" : "saved"}`}
    disabled={!isSaveEnabled}
    onClick={onSave}
  >
    Save
  </button>

 
        </div>
 
      </div>
 
      {/* ================= MODAL ================= */}
<Modal
        show={showPosition}
        onHide={() => setShowPosition(false)}
        centered
        size="lg"
        scrollable
>
 
        <Modal.Header closeButton className="knowmore-header">
<div className="w-100">
 
            <div className="d-flex flex-column flex-md-row gap-2 flex-wrap">
<span className="req-code">
                {requisition?.requisition_title || requisition?.requisitionTitle || "-"}
</span>
 
              <span className="date-text">
<i className="bi bi-calendar3 me-1"></i>
Start: {formatDMY(requisition?.registration_start_date)}
</span>
 
              <span className="date-text">
<i className="bi bi-calendar3 me-1"></i>
End: {formatDMY(requisition?.registration_end_date)}
</span>
</div>
 
            <div
              className="job-title mt-1"
              style={{ color: "#162B75", fontWeight: 500 }}
>
              {position?.positionName || position?.masterPositions?.positionName || "—"}
</div>
 
          </div>
</Modal.Header>
 
        <Modal.Body>
 
          {loading ? (
<div className="text-center py-5">
              Loading job details...
</div>
          ) : (
<>
<div className="stats-container mb-3">
<div className="row g-2 small">
 
                  <div className="col-12 col-md-4">
<span className="stat-label">Employment Type:</span>{" "}
<span className="stat-value">
                      {job?.employment_type || "-"}
</span>
</div>
 
                  <div className="col-12 col-md-4">
<span className="stat-label">Eligibility Age:</span>{" "}
<span className="stat-value">
                      {job?.eligibility_age_min} - {job?.eligibility_age_max} yrs
</span>
</div>
 
                  <div className="col-12 col-md-4">
<span className="stat-label">Vacancies:</span>{" "}
<span className="stat-value">
                      {job?.no_of_vacancies ?? 0}
</span>
</div>
 
                </div>
</div>
 
              <div className="info-card">
<div className="section-title">Mandatory Education:</div>
<ul className="section-list">
<li>{job?.mandatory_qualification || "-"}</li>
</ul>
 
                <div className="section-title mt-2">Preferred Education:</div>
<ul className="section-list">
<li>{job?.preferred_qualification || "-"}</li>
</ul>
</div>
 
              <div className="info-card">
<div className="section-title">Mandatory Experience:</div>
<ul className="section-list">
<li>{job?.mandatory_experience || "-"}</li>
</ul>
 
                <div className="section-title mt-2">Preferred Experience:</div>
<ul className="section-list">
<li>{job?.preferred_experience || "-"}</li>
</ul>
</div>
 
              <div className="info-card">
<div className="section-title">Key Responsibilities:</div>
<ul className="section-list">
<li>{job?.roles_responsibilities || "-"}</li>
</ul>
</div>
 
              {job?.positionStateDistributions?.length > 0 && (
<LocationWiseVacancyTable
                  positionStateDistributions={job.positionStateDistributions}
                  states={masterData?.states || []}
                  reservationCategories={masterData?.reservation_categories || []}
                  disabilities={masterData?.disabilities || []}
                />
              )}
 
              {job?.positionStateDistributions?.length === 0 &&
                job?.nationalCategoryDistribution && (
<NationalVacancyTable
                    nationalCategoryDistribution={job.nationalCategoryDistribution}
                  />
                )}
</>
          )}
 
        </Modal.Body>
 
        <Modal.Footer className="justify-content-center">
<button
            className="ok-btn"
            onClick={() => setShowPosition(false)}
>
            OK
</button>
</Modal.Footer>
 
      </Modal>
</>
  );
};
 
export default RequisitionStrip;