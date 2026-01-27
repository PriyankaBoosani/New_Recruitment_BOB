import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import NationalVacancyTable from "./NationalVacancyTable";
import LocationWiseVacancyTable from "./LocationWiseVacancyTable";
 
const RequisitionStrip = ({
  job,
  masterData,
  isSaved,
  onSave,
  isCardBg,
  isSaveEnabled
}) => {
  const [showPosition, setShowPosition] = useState(false);
 
  if (!job) return null;
 
  const reservationCategories = masterData?.reservation_categories || [];
  const disabilities = masterData?.disabilities || [];
 
  /* ===== DERIVE NATIONAL DATA FROM STATE DATA (FALLBACK) ===== */
  const derivedNationalData = [];
 
  if (
    !job.positionCategoryNationalDistributions?.length &&
    job.positionStateDistributions?.length
  ) {
    const summaryMap = {};
 
    job.positionStateDistributions.forEach(state => {
      reservationCategories.forEach(cat => {
        summaryMap[cat.category_code] =
          (summaryMap[cat.category_code] || 0) +
          (state.categories?.[cat.category_id] || 0);
      });
 
      disabilities.forEach(dis => {
        summaryMap[dis.disability_code] =
          (summaryMap[dis.disability_code] || 0) +
          (state.disability?.[dis.disability_id] || 0);
      });
    });
 
    Object.entries(summaryMap).forEach(([category_code, vacancies]) => {
      derivedNationalData.push({ category_code, vacancies });
    });
  }
 
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
        {/* LEFT CONTENT */}
        <div>
          <div className="small mb-1 d-flex align-items-center gap-3 flex-wrap">
            <span style={{ color: "#f36c21", fontWeight: 600 }}>
              {job.requisitionCode}
            </span>
 
            <span className="d-flex align-items-center gap-1 date-text">
              <i className="bi bi-calendar3"></i>
              Start: {job.startDate}
            </span>
 
            <span className="text-muted">|</span>
 
            <span className="d-flex align-items-center gap-1 date-text">
              <i className="bi bi-calendar3"></i>
              End: {job.endDate}
            </span>
          </div>
 
          <div style={{ color: "#162B75", fontWeight: 500 }}>
            {job.positionTitle}
          </div>
        </div>
 
        {/* RIGHT BUTTONS */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm blue-border blue-color px-3"
            onClick={() => setShowPosition(true)}
            style={{ backgroundColor: 'rgba(66, 87, 159, 0.12)' }}
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
 
      {/* ================= KNOW MORE MODAL (INLINE) ================= */}
      <Modal
        show={showPosition}
        onHide={() => setShowPosition(false)}
        centered
        size="lg"
        scrollable
      >
        {/* HEADER */}
        <Modal.Header closeButton className="knowmore-header">
          <div className="w-100">
            <div className="d-flex align-items-center gap-3">
              <span className="req-code">
                {job.requisition_code}
              </span>
 
              <span className="date-text">
                <i className="bi bi-calendar3 me-1"></i>
                Start: {job.registration_start_date}
              </span>
 
              <span className="date-divider">|</span>
 
              <span className="date-text">
                <i className="bi bi-calendar3 me-1"></i>
                End: {job.registration_end_date}
              </span>
            </div>
 
            <div className="job-title mt-1">
              {job.position_title}
            </div>
          </div>
        </Modal.Header>
 
        {/* BODY */}
        <Modal.Body>
          {/* TOP STATS */}
          <div className="stats-container mb-3">
            <div className="row g-2 small">
              <div className="col-md-4">
                <span className="stat-label">Employment Type:</span>{" "}
                <span className="stat-value">{job.employment_type}</span>
              </div>
              <div className="col-md-4">
                <span className="stat-label">Eligibility Age:</span>{" "}
                <span className="stat-value">
                  {job.eligibility_age_min} - {job.eligibility_age_max} yrs
                </span>
              </div>
              <div className="col-md-4">
                <span className="stat-label">Experience:</span>{" "}
                <span className="stat-value">
                  {job.mandatory_experience} yrs
                </span>
              </div>
              <div className="col-md-4">
                <span className="stat-label">Department:</span>{" "}
                <span className="stat-value">{job.dept_name}</span>
              </div>
              <div className="col-md-4">
                <span className="stat-label">Vacancies:</span>{" "}
                <span className="stat-value">{job.no_of_vacancies}</span>
              </div>
            </div>
          </div>
 
          {/* EDUCATION */}
          <div className="info-card">
            <div className="section-title">Mandatory Education:</div>
            <ul className="section-list">
              <li>{job.mandatory_qualification || "Not specified"}</li>
            </ul>
 
            <div className="section-title mt-2">Preferred Education:</div>
            <ul className="section-list">
              <li>{job.preferred_qualification || "Not specified"}</li>
            </ul>
          </div>
 
          {/* EXPERIENCE */}
          <div className="info-card">
            <div className="section-title">Mandatory Experience:</div>
            <ul className="section-list">
              <li>{job.mandatory_experience} years</li>
            </ul>
 
            <div className="section-title mt-2">Preferred Experience:</div>
            <ul className="section-list">
              <li>{job.preferred_experience} years</li>
            </ul>
          </div>
 
          {/* RESPONSIBILITIES */}
          <div className="info-card">
            <div className="section-title">Key Responsibilities:</div>
            <ul className="section-list">
              <li>{job.roles_responsibilities}</li>
            </ul>
          </div>
 
          {/* CATEGORY WISE RESERVATION */}
          {job?.isLocationWise ? (
            <NationalVacancyTable
              positionStateDistributions={job.positionStateDistributions}
            />
          ) : (
          <LocationWiseVacancyTable
              positionStateDistributions={job.positionStateDistributions}
              states={masterData?.states || []}
              reservationCategories={reservationCategories}
              disabilities={disabilities}
            />
 
          )}


          
        </Modal.Body>
 
        {/* FOOTER */}
        <Modal.Footer className="justify-content-center">
          <button className="ok-btn" onClick={() => setShowPosition(false)}>
            OK
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
 
export default RequisitionStrip;

