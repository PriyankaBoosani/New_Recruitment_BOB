import React, { useState } from "react";

import "../../style/css/Committee.css";
import CommitteeHistoryList from './components/CommitteeHistoryList';
import { useAssignPositions } from "./hooks/useAssignPositions";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";
import ErrorModal from "./components/ErrorModal";
import Select from "react-select";
import Loader from "../../shared/components/Loader";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { FiUpload } from "react-icons/fi";
import PositionAssignmentImportModal from "./components/PositionAssignmentImportModal";


const AssignPositionsPage = () => {
  const { t } = useTranslation(["interviewPanelCommittee", "common"]);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  const {
    requisitions,
    positions,
    selectedRequisition,
    selectedPosition,
    setSelectedPosition,
    handleRequisitionChange,
    loading,
    availablePanels,
    setAvailablePanels,
    updateCommitteeDate,
    activeTab,
    setActiveTab,
    showHistory,
    setShowHistory,
    selectedCommittees,
    setSelectedCommittees,
    context,
    setContext,
    handleAssignCommittees,
    panelErrors,
    setPanelErrors,
     showErrorModal,
    setShowErrorModal,
    errorMessage,
    setErrorMessage,
    errorList,
    setErrorList,
    isDirty,
    bulkImportPositionAssignments,
    downloadPositionAssignmentTemplate,
    loadPositionData

  } = useAssignPositions();

  const today = new Date().toISOString().split("T")[0];

  const selectedPositionTitle =
    positions.find(
      p => p.jobPositions?.positionId === selectedPosition
    )?.masterPositions?.positionName || "";


  const toggleCommittee = (type, committee) => {
    setSelectedCommittees(prev => {
      const isSelected = prev[type].some(c => c.id === committee.id);

      if (isSelected) {
        // REMOVE → move back to available
        setAvailablePanels(ap => [...ap, committee]);

        return {
          ...prev,
          [type]: prev[type].filter(c => c.id !== committee.id),
        };
      } else {
        // ADD → remove from available
        setAvailablePanels(ap =>
          ap.filter(c => c.id !== committee.id)
        );

        return {
          ...prev,
          [type]: [
            ...prev[type],
            {
              ...committee,
              startDate: committee.startDate || "",
              endDate: committee.endDate || "",
              canEdit: true   
            }
          ],
        };
      }
    });
  };

  const renderAvailableCommittee = (committee, type) => (
    <div className="committee-row" key={committee.id}>
      <div>
        <div className="committee-title" style={{width: "350px"}} >{committee.name}</div>
        <div className="committee-chips">
          {committee.members.map(m => (
            <span key={m} className="chip">{m.name}</span>
          ))}
        </div>
      </div>

      <button
        className="action-pill add"
        onClick={() => toggleCommittee(type, committee)}
      >
       {t("add_button")} →
      </button>
    </div>
  );
  const renderSelectedCommittee = (committee, type) => {
    const errorKey = `${type}_${committee.id}`;
    const errors = panelErrors?.[errorKey] || {};

    return (
      <div className="committee-row selected" key={committee.id}>
        <div>
          <div className="committee-title" style={{width: "350px"}}>{committee.name}</div>

          <div className="committee-chips">
            {committee.members.map(m => (
              <span key={m.name} className="chip">{m.name}</span>
            ))}
          </div>

          <div className="date-row">
            <div>
              <label>{t("start_date_label")}</label>
              <input
                type="date"
                 min={today}
                value={committee.startDate}
                disabled={!committee.canEdit}
                onChange={(e) =>
                  updateCommitteeDate(type, committee.id, "startDate", e.target.value)
                }
              />
              {errors.startDate && (
                  <div className="field-error">{t(errors.startDate)}</div>
              )}
            </div>

            <div>
              <label>{t("end_date_label")}</label>
              <input
                type="date"
                  min={committee.startDate || today}
                value={committee.endDate}
                disabled={!committee.canEdit}
                onChange={(e) =>
                  updateCommitteeDate(type, committee.id, "endDate", e.target.value)
                }
              />
              {errors.endDate && (
                <div className="field-error">{t(errors.endDate)}</div>
              )}
            </div>
          </div>
        </div>

        <button
          className="action-pill remove"
           onClick={() => toggleCommittee(type, committee)}
            //onClick={() => committee.canEdit && toggleCommittee(type, committee)}
           disabled={!committee.canEdit}
        >
        ← {t("remove_button")}
        </button>
      </div>
    );
  };


  const filteredPanels = availablePanels.filter(
    p =>
      p.committeeName?.toUpperCase() === activeTab
  );

  const selectedRequisitionObj = requisitions.find(
  r => r.id === selectedRequisition
);

const normalizedRequisition = {
  ...selectedRequisitionObj,
  registration_start_date: selectedRequisitionObj?.startDate,
  registration_end_date: selectedRequisitionObj?.endDate,
};


const selectedPositionObj = positions.find(
  p => p.jobPositions?.positionId === selectedPosition
)?.jobPositions;



const selectedPositionFull = positions.find(
  p => p.jobPositions?.positionId === selectedPosition
);
const normalizedPosition = {
  ...selectedPositionObj,
  positionName: selectedPositionFull?.masterPositions?.positionName
};
  const requisitionOptions = requisitions.map(req => ({
  value: req.id,
  label: `${req.requisitionCode} - ${req.requisitionTitle}`
}));
 
const positionOptions = positions.map(pos => ({
  value: pos.jobPositions?.positionId,
  label: pos.masterPositions?.positionName
}));
const hasAnySelectedPanels =
  selectedCommittees.SCREENING.length > 0 ||
  selectedCommittees.INTERVIEW.length > 0 ||
  selectedCommittees.COMPENSATION.length > 0;
  return (
    <div className="assign-positions-page">
      {/* ===== PAGE HEADER ===== */}
    
   

      {/* ===== SELECTION CONTROLS ===== */}
      <div className="selection-section">
        <div class="mb-3"><div class="assign-position-title">{t("select_position_title")}</div><div class="assign-position-muted">{t("choose_requisition_position_desc")}</div></div>
        <div className="selection-grid">
 
          {/* Requisition */}
          <div className="form-group">
            <label className="form-label">{t("requisition_label")}</label>
            <Select
             isSearchable
              placeholder={t("select_requisition_placeholder")}
              options={requisitionOptions}
              value={
                requisitionOptions.find(
                  option => option.value === selectedRequisition
                ) || null
              }
              onChange={(selectedOption) =>
                handleRequisitionChange({
                  target: { value: selectedOption?.value || "" }
                })
              }
              classNamePrefix="custom-select"
            />
          </div>
 
          {/* Position */}
          <div className="form-group">
            <label className="form-label">{t("position_label")}</label>
            <Select
              isSearchable
              placeholder={t("select_position_placeholder")}
              options={positionOptions}
              value={
                positionOptions.find(
                  option => option.value === selectedPosition
                ) || null
              }
              onChange={(selectedOption) =>
                setSelectedPosition(selectedOption?.value || "")
              }
              isDisabled={!selectedRequisition}
              classNamePrefix="custom-select"
            />
          </div>
 
        </div>

        {/* ===== REQUISITION STRIP ===== */}
      {selectedRequisition && selectedPosition && (
        <div className="requisition-strip-section">
          <RequisitionStrip
             requisition={normalizedRequisition}
              position={normalizedPosition}
              isCardBg={false}
              isSaveEnabled={false}
          />
        </div>
      )}
      </div>

      

      {/* ===== COMMITTEE CONFIGURATION ===== */}
      <div className="committee-config-section">
        <div className="config-header">
          <div className="config-title-section">
            <h2 className="config-title">{t("configure_committees")}</h2>
            <p className="config-subtitle">
              {selectedPositionTitle
                ? t("assign_to_position", { position: selectedPositionTitle })
                : t("select_position_to_assign")}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="assign-button" 
              onClick={handleAssignCommittees}
             // disabled={!selectedPosition}
              disabled={!selectedPosition || !isDirty()}
              

            >
             {loading ? t("assigning") : t("assign_committees")}
            </button>
            <button 
              className="assign-button bulk-import-btn" 
              onClick={() => setShowBulkImportModal(true)}
              disabled={loading}
            >
              <FiUpload className="me-2" />
              {t("interviewPanelCommittee:bulk_import")}
            </button>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="committee-tabs">
          <button
            className={`tab-item ${activeTab === "SCREENING" ? "active" : ""}`}
            onClick={() => setActiveTab("SCREENING")}
          >
           {t("screening_committee")}
          </button>
          <button
            className={`tab-item ${activeTab === "INTERVIEW" ? "active" : ""}`}
            onClick={() => setActiveTab("INTERVIEW")}
          >
            {t("interview_committee")}
          </button>
          <button
            className={`tab-item ${activeTab === "COMPENSATION" ? "active" : ""}`}
            onClick={() => setActiveTab("COMPENSATION")}
          >
            {t("compensation_committee")}
          </button>
        </div>

        {/* ===== DUAL PANELS ===== */}
        <div className="panels-container">
          {/* Available Panels */}
          <div className="panel-box available">
            <div className="panel-header">
              <h3 className="panel-title">{t("available_panels")}</h3>
              <span className="panel-count">{filteredPanels.length}</span>
            </div>
            <div className="panel-divider"></div>
            <div className="assignpanel-content">
              {filteredPanels.map(c => renderAvailableCommittee(c, activeTab))}
            </div>
          </div>

          {/* Swap Icon */}
          <div className="swap-divider">
            <div className="swap-icon">⇄</div>
          </div>

          {/* Selected Panels */}
          <div className="panel-box selected">
            <div className="panel-header">
              <h3 className="panel-title">{t("selected_panels")}</h3>
              <span className="panel-count">{selectedCommittees[activeTab].length}</span>
            </div>
            <div className="panel-divider"></div>
            <div className="assignpanel-content">
              {selectedCommittees[activeTab].length > 0 ? (
                selectedCommittees[activeTab].map(c => renderSelectedCommittee(c, activeTab))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">{t("no_panels_selected")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

<ErrorModal
  show={showErrorModal}
  message={errorMessage}
  errors={errorList}
  onClose={() => setShowErrorModal(false)}
/>

<Modal
  show={showBulkImportModal}
  onHide={() => setShowBulkImportModal(false)}
  size="lg"
  centered
>
  <Modal.Header closeButton>
    <Modal.Title className="header-title">{t("interviewPanelCommittee:bulk_import_position_assignments")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <PositionAssignmentImportModal
      t={t}
      onClose={() => setShowBulkImportModal(false)}
      onSuccess={() => {

        loadPositionData(selectedPosition);
        setShowBulkImportModal(false);
      }}
    />
  </Modal.Body>
</Modal>
{loading && <Loader />}
    </div>
  );
};

export default AssignPositionsPage;
