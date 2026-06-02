import React from "react";

const InterviewCentreConfirmModal = ({ show, onProceed, onReview, onClose }) => {
  if (!show) return null;

  return (
    <div className="ipc-alert-overlay">
      <div className="ipc-alert-modal" style={{ position: "relative" }}>
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose}></button>

        <div className="ipc-alert-icon">
          <i className="bi bi-building-check"></i>
        </div>

        <h4 className="ipc-alert-title">Confirm Interview Centre Availability</h4>

        <p className="ipc-alert-message">
          Please confirm that all allocated interview centres are available for the scheduled
          interview slots.
        </p>

        <p className="ipc-alert-message mt-3">
          If any centre is unavailable, you can review and update the interview centre allocation
          before proceeding.
        </p>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onReview}>
            Review Centres
          </button>

          <button className="btn btn-primary" onClick={onProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCentreConfirmModal;
