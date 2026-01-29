
import React from "react";
import { Modal } from "react-bootstrap";
import NationalVacancyTable from "./NationalVacancyTable";

const KnowMoreModal = ({ show, onHide, selectedJob, masterData }) => {
  if (!selectedJob) return null;

  const reservationCategories = masterData?.reservation_categories || [];
  const disabilities = masterData?.disabilities || [];

  /* ===== DERIVE NATIONAL DATA FROM STATE DATA (FALLBACK) ===== */
  const derivedNationalData = [];

  if (
    !selectedJob.positionCategoryNationalDistributions?.length &&
    selectedJob.positionStateDistributions?.length
  ) {
    const summaryMap = {};

    selectedJob.positionStateDistributions.forEach(state => {
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
    <Modal show={show} onHide={onHide} centered size="lg" scrollable>
      {/* ===== HEADER ===== */}
    <Modal.Header closeButton className="knowmore-header">
  <div className="w-100">

    {/* ===== TOP ROW ===== */}
    <div className="d-flex align-items-center gap-3 header-top">
      <span className="req-code">
        {selectedJob.requisition_code}
      </span>

      <span className="date-text">
        <i className="bi bi-calendar3 me-1"></i>
        Start: {selectedJob.registration_start_date}
      </span>

      <span className="date-divider">|</span>

      <span className="date-text">
        <i className="bi bi-calendar3 me-1"></i>
        End: {selectedJob.registration_end_date}
      </span>
    </div>

    {/* ===== JOB TITLE ===== */}
    <div className="job-title mt-1">
      {selectedJob.position_title}
    </div>

  </div>
</Modal.Header>


      {/* ===== BODY ===== */}
      <Modal.Body>
        {/* ===== TOP STATS ===== */}
        <div className="stats-container mb-3">
          <div className="row g-2 small">
            <div className="col-md-4">
              <span className="stat-label">Employment Type:</span>{" "}
              <span className="stat-value">{selectedJob.employment_type}</span>
            </div>
            <div className="col-md-4">
              <span className="stat-label">Eligibility Age:</span>{" "}
              <span className="stat-value">
                {selectedJob.eligibility_age_min} -{" "}
                {selectedJob.eligibility_age_max} yrs
              </span>
            </div>
            <div className="col-md-4">
              <span className="stat-label">Experience:</span>{" "}
              <span className="stat-value">
                {selectedJob.mandatory_experience} yrs
              </span>
            </div>
            <div className="col-md-4">
              <span className="stat-label">Department:</span>{" "}
              <span className="stat-value">{selectedJob.dept_name}</span>
            </div>
            <div className="col-md-4">
              <span className="stat-label">Vacancies:</span>{" "}
              <span className="stat-value">{selectedJob.no_of_vacancies}</span>
            </div>
          </div>
        </div>

        {/* ===== EDUCATION ===== */}
        <div className="info-card">
          <div className="section-title">Mandatory Education:</div>
          <ul className="section-list">
            <li>{selectedJob.mandatory_qualification || "Not specified"}</li>
          </ul>

          <div className="section-title mt-2">Preferred Education:</div>
          <ul className="section-list">
            <li>{selectedJob.preferred_qualification || "Not specified"}</li>
          </ul>
        </div>

        {/* ===== EXPERIENCE ===== */}
        <div className="info-card">
          <div className="section-title">Mandatory Experience:</div>
          <ul className="section-list">
            <li>{selectedJob.mandatory_experience} years</li>
          </ul>

          <div className="section-title mt-2">Preferred Experience:</div>
          <ul className="section-list">
            <li>{selectedJob.preferred_experience} years</li>
          </ul>
        </div>

        {/* ===== RESPONSIBILITIES ===== */}
        <div className="info-card">
          <div className="section-title">Key Responsibilities:</div>
          <ul className="section-list">
            <li>{selectedJob.roles_responsibilities}</li>
          </ul>
        </div>

        {/* ===== CATEGORY WISE RESERVATION (NATIONAL) ===== */}
        <NationalVacancyTable
          positionCategoryNationalDistributions={
            selectedJob.positionCategoryNationalDistributions?.length
              ? selectedJob.positionCategoryNationalDistributions
              : derivedNationalData
          }
          reservationCategories={reservationCategories}
          disabilities={disabilities}
        />
      </Modal.Body>

      {/* ===== FOOTER ===== */}
  <Modal.Footer className="justify-content-center">
  <button className="ok-btn" onClick={onHide}>
    OK
  </button>
</Modal.Footer>

    </Modal>
  );
};

export default KnowMoreModal;

