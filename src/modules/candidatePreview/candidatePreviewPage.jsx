import React from "react";
import "../../style/css/PreviewModal.css";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ApplicationForm from "../candidatePreview/components/ApplicationForm";

const CandidatePreviewPage = ({
  onHide,
  previewData,
  selectedJob,
  formErrors,
  setFormErrors,
}) => {
  return (
    <div className="bob-preview-page container-fluid p-4">

      {/* Close Button */}
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: "6px", right: "15px", zIndex: 1 }}
        onClick={onHide}
        aria-label="Close"
      />

      {/* Requisition Strip */}
      <RequisitionStrip
        requisition={{
          requisition_code: selectedJob?.requisition_code,
          start_date: selectedJob?.start_date,
          end_date: selectedJob?.end_date,
        }}
        positionTitle={selectedJob?.position_title}
        // isSaveVisisble={false}
      />

      {/* Application Form (ALL ACCORDIONS INSIDE THIS) */}
      <ApplicationForm
        previewData={previewData}
        selectedJob={selectedJob}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

    </div>
  );
};

export default CandidatePreviewPage;
