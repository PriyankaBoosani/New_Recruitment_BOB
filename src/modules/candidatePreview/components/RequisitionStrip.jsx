// src/modules/candidatePreview/components/RequisitionStrip.jsx

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import NationalVacancyTable from "./NationalVacancyTable";
import LocationWiseVacancyTable from "./LocationWiseVacancyTable";

import candidateWorkflowServices from "../services/CandidateWorkflowServices";
import masterApiService from "../../master/services/masterApiService";   // ADDED
import { mapJobPositionToRequisitionStrip } from "../mappers/candidatePreviewMapper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const RequisitionStrip = ({
  requisition,
  position,
  isSaved,
  onSave,
  isCardBg,
  isSaveEnabled,
  isSaveBtn
}) => {

  const [showPosition, setShowPosition] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const [masterData, setMasterData] = useState(null);   //  INTERNAL

  const orderedPattern =
    /^\s*(\(?\d+[\).\]]|\(?[ivxlcdm]+[\).\]])\s*/i;

  const renderBullets = (text) => {
    if (!text) return <li>-</li>;

    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    return lines.map((line, idx) => {
      const cleaned = line.replace(/\.+$/, "");

      // ✅ If already numbered → DO NOT ADD BULLET
      if (orderedPattern.test(cleaned)) {
        return (
          <div key={idx} className="no-bullet-line">
            {cleaned}
          </div>
        );
      }

      // ✅ Otherwise normal bullet
      return <li key={idx}>{cleaned}</li>;
    });
  };






  const formatDMY = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch {
      return dateStr;
    }
  };


  /* ================= LOAD MASTER DATA ================= */

  // useEffect(() => {
  //   const loadMasters = async () => {
  //     try {
  //       const res = await masterApiService.getMasterDisplayAll();
  //       setMasterData(res.data || {});
  //     } catch (err) {
  //       console.error("Failed to load master data", err);
  //       setMasterData({});
  //     }
  //   };

  //   loadMasters();
  // }, []);



  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [masterRes, zonalRes] = await Promise.all([
          masterApiService.getMasterDisplayAll(),
          masterApiService.getZonalStates()
        ]);

        setMasterData({
          ...masterRes.data,

          // use ZONAL states (correct IDs)
          states: (zonalRes.data || []).map(s => ({
            id: String(s.zonalStateID),
            name: s.stateName,
          }))
        });

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
        toast.error(t("candidateWorkflow:failed_load_position_details"));
      } finally {
        setLoading(false);
      }
    };

    fetchJob();

  }, [position?.positionId, masterData]);

  const handleViewPosition = () => {
    setShowPosition(true);
  };

  const { t } = useTranslation(["candidateWorkflow", "common"]);
  const formatExperience = (years = 0, months = 0) => {
    if (years === 0 && months === 0) return `0 ${t("candidateWorkflow:years")}`;

    if (years > 0 && months === 0)
      return `${years} ${t("candidateWorkflow:years")}`;

    if (years === 0 && months > 0)
      return `${months} ${t("candidateWorkflow:months")}`;

    return `${years} ${t("candidateWorkflow:years")} ${months} ${t("candidateWorkflow:months")}`;
  };

  return (
    <>
      {/* ================= STRIP ================= */}
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center px-3 py-2 wraps"
        style={{
          background: isCardBg ? "#ffffff" : "none",
          border: isCardBg ? "1px solid #e0e0e0" : "none",
          borderRadius: "8px"
        }}
      >

        {/* ===== LEFT CONTENT ===== */}
        <div className="w-100">

          <div className="d-flex flex-column flex-md-row flex-wrap align-items-center gap-2">

            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>
                  {requisition?.requisitionCode || requisition?.requisition_code || ""} -{" "}
                  {requisition?.requisitionTitle || requisition?.requisition_title || "-"}
                </Tooltip>
              }
            >
              <span className="req-code me-3 cursor-pointer">
                {requisition?.requisitionCode || requisition?.requisition_code || ""} -{" "}
                {requisition?.requisitionTitle || requisition?.requisition_title || "-"}
              </span>
            </OverlayTrigger>



            <span className="date-text">
              <i className="bi bi-calendar3 me-1"></i>
              {t("candidateWorkflow:start")}: {formatDMY(
                requisition?.startDate || requisition?.registration_start_date
              )}



            </span>

            <span className="date-divider">|</span>

            <span className="date-text">
              <i className="bi bi-clock me-1"></i>
              {t("candidateWorkflow:end")}: {formatDMY(
                requisition?.endDate || requisition?.registration_end_date
              )}
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
            {t("candidateWorkflow:view_position")}
          </button>
          {isSaveBtn && (
            <button
              className={`save-btn ${isSaveEnabled ? "unsaved" : "saved"}`}
              disabled={!isSaveEnabled}
              onClick={onSave}
            >
              {t("common:save")}
            </button>
          )}

        </div>

      </div>

      {/* ================= MODAL ================= */}
      <Modal
        show={showPosition}
        onHide={() => setShowPosition(false)}
        centered
        size="lg"
      // scrollable
      >

        <Modal.Header closeButton className="knowmore-header">
          <div className="w-100">

            <div className="modal-header-row">
              <span className="modal-req-title">
                {requisition?.requisition_title || requisition?.requisitionTitle || "-"}
              </span>

              <span className="modal-date">
                <i className="bi bi-calendar3 me-1"></i>
                {t("candidateWorkflow:start")}: {formatDMY(requisition?.registration_start_date)}
              </span>

              <span className="modal-divider">|</span>

              <span className="modal-date">
                <i className="bi bi-clock me-1"></i>
                {t("candidateWorkflow:end")}: {formatDMY(requisition?.registration_end_date)}
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
              {t("candidateWorkflow:loading_job_details")}
            </div>
          ) : (
            <>
              <div className="stats-container mb-3">
                <div className="row g-2 small">

                  {/* Employment */}
                  <div className="col-12 col-md-4">
                    <span className="stat-label">{t("candidateWorkflow:employment_type")}:</span>{" "}
                    <span className="stat-value">
                      {job?.employment_type || "-"}
                    </span>
                  </div>

                  {/* Contract — show only if employment type is Contract */}
                  {job?.employment_type?.toLowerCase() === "contract" && (
                    <div className="col-12 col-md-4">
                      <span className="stat-label">{t("candidateWorkflow:contract_period")}:</span>{" "}
                      <span className="stat-value">
                        {job?.contract_years ?? 0} {t("candidateWorkflow:years")}
                      </span>
                    </div>
                  )}


                  {/* Experience */}
                  <div className="col-12 col-md-4">
                    <span className="stat-label">{t("candidateWorkflow:experience")}:</span>{" "}
                    <span className="stat-value">
                      {formatExperience(
                        job?.mandatory_experience_years, job?.mandatory_experience_months
                      )}
                    </span>
                  </div>

                  {/* Eligibility */}
                  <div className="col-12 col-md-4">
                    <span className="stat-label">{t("candidateWorkflow:eligibility_age")}:</span>{" "}
                    <span className="stat-value">
                      {job?.eligibility_age_min} - {job?.eligibility_age_max} {t("candidateWorkflow:years")}
                    </span>
                  </div>

                  {/* Department */}
                  <div className="col-12 col-md-4">
                    <span className="stat-label">{t("candidateWorkflow:department")}:</span>{" "}
                    <span className="stat-value">
                      {job?.dept_name || "-"}
                    </span>
                  </div>

                  {/* Vacancies */}
                  <div className="col-12 col-md-4">
                    <span className="stat-label">{t("candidateWorkflow:vacancies")}:</span>{" "}
                    <span className="stat-value">
                      {job?.no_of_vacancies ?? 0}
                    </span>
                  </div>

                </div>
              </div>


              <div className="info-card">
                <div className="section-title">{t("candidateWorkflow:mandatory_education")}:</div>
                <ul className="section-list">
                  <li style={{ whiteSpace: "pre-line" }}>{job?.mandatory_qualification || "-"}</li>
                </ul>

                <div className="section-title mt-2">{t("candidateWorkflow:preferred_education")}:</div>
                <ul className="section-list">
                  <li style={{ whiteSpace: "pre-line" }}>{job?.preferred_qualification || "NA"}</li>
                </ul>
              </div>

              <div className="info-card">

                <div className="section-title">{t("candidateWorkflow:mandatory_experience")}:</div>
                <ul className="section-lists">
                  {renderBullets(job?.mandatory_experience)}
                </ul>




                <div className="section-title mt-2">{t("candidateWorkflow:preferred_experience")}:</div>
                <ul className="section-lists">
                  {renderBullets(job?.preferred_experience || "NA")}
                </ul>



              </div>

              <div className="info-card">
                <div className="section-title">{t("candidateWorkflow:key_responsibilities")}:</div>
                <ul className="section-lists">
                  {renderBullets(job?.roles_responsibilities)}
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
            {t("common:ok")}
          </button>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default RequisitionStrip;