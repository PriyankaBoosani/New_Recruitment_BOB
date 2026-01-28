// src/modules/candidatePreview/CandidatePreviewPage.jsx

import React, { useEffect, useState } from "react";
import "../../style/css/PreviewModal.css";

import { useLocation } from "react-router-dom";

import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";

import masterApiService from "../jobPosting/services/masterApiService";
import candidateWorkflowServices from "../candidatePreview/services/CandidateWorkflowServices";
import { mapCandidateToPreview } from "../candidatePreview/mappers/candidatePreviewMapper";

import HeaderWithBack from "../../../src/shared/components/HeaderWithBack";

/*
   DUMMY FALLBACK DATA (USED WHEN NAV DATA NOT PRESENT)
*/
const DUMMY_REQUISITION = {
  requisition_code: "7127b402-32e1-46b8-a14e-77d65d01aa8d",
  requisition_title: "Updated Title BOB/HRM/2025",
  registration_start_date: "2025-01-15",
  registration_end_date: "2026-12-31"
};

const DUMMY_POSITION = {
  positionId: "44262c87-2438-4e7b-91fd-5baac3988a4b",
  positionName: "NaveenTestPosition2_updated"
};

const CandidatePreviewPage = ({ onHide }) => {
  const location = useLocation();
  const state = location.state || {};

  /* ================= STATE ================= */
  const [masters, setMasters] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= NAVIGATION DATA ================= */
  const candidateId = state?.candidate?.candidateId;
  const applicationId = state?.positionId;

  const navRequisition = state?.requisition;
  const navPosition = state?.position;

  /* ================= FINAL DATA (NAV → FALLBACK) ================= */
  const resolvedRequisition = navRequisition ?? DUMMY_REQUISITION;
  const resolvedPosition = navPosition ?? DUMMY_POSITION;

  /* ================= LOAD MASTER + CANDIDATE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        /* -------- MASTER DATA -------- */
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
          countries: raw.countries || []
        };

        setMasters(normalizedMasters);

        /* -------- CANDIDATE DATA -------- */
        if (candidateId && applicationId) {
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
        }
      } catch (err) {
        console.error("Candidate preview load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [candidateId, applicationId]);

  /* ================= RENDER ================= */
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
      <RequisitionStrip
        requisition={resolvedRequisition}
        position={resolvedPosition}
        isCardBg={true}
        isSaveEnabled={false}
        masterData={masters}
      />

      {/* ================= APPLICATION FORM ================= */}
      <div className="mt-3">
        {loading ? (
          <div className="text-center py-4">Loading candidate details...</div>
        ) : (
          <ApplicationForm
            previewData={previewData}
            normalizedMasters={masters}
          />
        )}
      </div>
    </div>
  );
};

export default CandidatePreviewPage;





// navigate("/candidate-preview", {
//   state: {
//     candidate: c,
//     positionId: c.positionId,
//     requisition: {
//       requisition_code: req.requisitionCode,
//       requisition_title: req.requisitionTitle,
//       registration_start_date: req.startDate,
//       registration_end_date: req.endDate
//     },
//     position: {
//       positionId: pos.jobPositions.positionId,
//       positionName: pos.masterPositions.positionName
//     }
//   }
// });
