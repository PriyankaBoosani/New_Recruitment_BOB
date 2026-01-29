// src/modules/candidatePreview/components/RequisitionStrip.jsx
 
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
 
import NationalVacancyTable from "./NationalVacancyTable";
import LocationWiseVacancyTable from "./LocationWiseVacancyTable";
 
import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import { mapJobPositionToRequisitionStrip } from "../mappers/candidatePreviewMapper";
 
const RequisitionStrip = ({
  requisition,
  position,
  masterData,
  isSaved,
  onSave,
  isCardBg,
  isSaveEnabled
}) => {
  const [showPosition, setShowPosition] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const reservationCategories = masterData?.reservation_categories || [];
  const disabilities = masterData?.disabilities || [];
 
  /* =====================================================
     FETCH JOB DATA AUTOMATICALLY (ON LOAD / ID CHANGE)
  ===================================================== */
useEffect(() => {
  if (!position?.positionId) return;
 
  const fetchJob = async () => {
    try {
      setLoading(true);
 
      const res =
        await candidateWorkflowServices.getJobPositionById(
          position.positionId
        );
 
      const mapped =
        mapJobPositionToRequisitionStrip(res.data, masterData);
        console.log("Fetched job details:", mapped);
      setJob(mapped);
    } catch (err) {
      console.error("Failed to fetch job details", err);
    } finally {
      setLoading(false);
    }
  };
 
  fetchJob();
}, [position?.positionId, masterData]);
 
 
  /* ================= VIEW POSITION ================= */
  const handleViewPosition = () => {
  setShowPosition(true);
};
 
 
  return (
    <>
      {/* ================= REQUISITION STRIP ================= */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2"
        style={{
          background: isCardBg ? "#ffffff" : "none",
          border: isCardBg ? "1px solid #e0e0e0" : "none",
          borderRadius: "8px"
        }}
      >
        {/* ===== SAME HEADER AS MODAL ===== */}
<div>
  <div className="d-flex align-items-center gap-3">
    <span className="req-code">
      {requisition?.requisition_code || requisition?.requisitionCode || "-"} - {requisition?.requisition_title || requisition?.requisitionTitle || "-"}
    </span>
 
    <span className="date-text">
      <i className="bi bi-calendar3 me-1"></i>
      Start: { requisition?.registration_start_date || "-"}
    </span>
 
    <span className="date-divider">|</span>
 
    <span className="date-text">
      <i className="bi bi-calendar3 me-1"></i>
       End: {requisition?.registration_end_date || "-"}
    </span>
  </div>
 
  <div
    className="job-title mt-1"
    style={{ color: "#162B75", fontWeight: 500 }}
  >
    {position?.positionName || position?.masterPositions?.positionName || "—"}
  </div>
</div>
 
 
        {/* ===== ACTION BUTTONS ===== */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm blue-border blue-color px-3"
            onClick={handleViewPosition}
            disabled={loading || !position}
            style={{ backgroundColor: "rgba(66, 87, 159, 0.12)" }}
          >
            View Position
          </button>
 
          {isSaveEnabled && (
            <button
              className={`save-btn ${isSaved ? "saved" : "unsaved"}`}
              disabled={isSaved}
              onClick={onSave}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </div>
 
      {/* ================= KNOW MORE MODAL ================= */}
      <Modal
        show={showPosition}
        onHide={() => setShowPosition(false)}
        centered
        size="lg"
        scrollable
      >
        {/* ===== MODAL HEADER (SAME DATA) ===== */}
       <Modal.Header closeButton className="knowmore-header">
  <div className="w-100">
    <div className="d-flex align-items-center gap-3">
      <span className="req-code">
        {requisition?.requisition_title || requisition?.requisitionTitle || "-"}
      </span>
 
      <span className="date-text">
        <i className="bi bi-calendar3 me-1"></i>
        Start: {requisition?.registration_start_date || "-"}
      </span>
 
      <span className="date-divider">|</span>
 
      <span className="date-text">
        <i className="bi bi-calendar3 me-1"></i>
        End: {requisition?.registration_end_date || "-"}
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
 
        {/* ================= BODY ================= */}
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              Loading job details...
            </div>
          ) : (
            <>
              {/* TOP STATS */}
              <div className="stats-container mb-3">
                <div className="row g-2 small">
                  <div className="col-md-4">
                    <span className="stat-label">Employment Type:</span>{" "}
                    <span className="stat-value">
                      {job?.employment_type || job?.employment_type || "-"}
                    </span>
                  </div>
 
                  <div className="col-md-4">
                    <span className="stat-label">Eligibility Age:</span>{" "}
                    <span className="stat-value">
                      {job?.eligibility_age_min} -{" "}
                      {job?.eligibility_age_max} yrs
                    </span>
                  </div>
 
                  <div className="col-md-4">
                    <span className="stat-label">Vacancies:</span>{" "}
                    <span className="stat-value">
                      {job?.no_of_vacancies ?? 0}
                    </span>
                  </div>
                </div>
              </div>
 
              {/* EDUCATION */}
              <div className="info-card">
                <div className="section-title">Mandatory Education:</div>
                <ul className="section-list">
                  <li>{job?.mandatory_qualification || "-"}</li>
                </ul>
 
                <div className="section-title mt-2">
                  Preferred Education:
                </div>
                <ul className="section-list">
                  <li>{job?.preferred_qualification || "-"}</li>
                </ul>
              </div>
 
              {/* EXPERIENCE */}
              <div className="info-card">
                <div className="section-title">Mandatory Experience:</div>
                <ul className="section-list">
                  <li>{job?.mandatory_experience || "-"}</li>
                </ul>
 
                <div className="section-title mt-2">
                  Preferred Experience:
                </div>
                <ul className="section-list">
                  <li>{job?.preferred_experience || "-"}</li>
                </ul>
              </div>
 
              {/* RESPONSIBILITIES */}
              <div className="info-card">
                <div className="section-title">
                  Key Responsibilities:
                </div>
                <ul className="section-list">
                  <li>{job?.roles_responsibilities || "-"}</li>
                </ul>
              </div>
 
{/* ================= VACANCY DISTRIBUTION ================= */}
 
{/* STATE-WISE (when location preference enabled) */}
{/* ================= VACANCY DISTRIBUTION ================= */}
 
 
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
 
        {/* ================= FOOTER ================= */}
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