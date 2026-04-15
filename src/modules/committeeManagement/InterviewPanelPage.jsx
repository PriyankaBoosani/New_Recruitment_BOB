import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage";
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";
// import { useAssignPositions } from "./hooks/useAssignPositions";
import { FiUsers, FiFileText, FiUpload } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ErrorModal from "./components/ErrorModal";
import PanelImportModal from "./components/PanelImportModal";
import { useTranslation } from "react-i18next";
import PositionAssignmentImportModal from "./components/PositionAssignmentImportModal";
import bulbIcon from "../../assets/bulb-icon.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const InterviewPanelPage = () => {


  const {
    panels,
    loading,
    communityOptions,
    membersOptions,
    formData,
    setFormData,
    errors,
    setErrors,
    // editAssignedMembers,
    // setEditAssignedMembers,

    initData,
    fetchPanels, // ✅ RETURNED
    handleSave,
    handleDelete,
    handleEdit,
    clearError,


    page,
    setPage,
    totalPages,
    search,
    setSearch,
    showFilters,
    setShowFilters,
    // sortConfig,
    // handleSort,
    // sortedPanels,
    size,
    setSize,
    activeTab,
    setActiveTab,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
    bulkAddPanels,
    downloadPanelTemplate,


  } = useInterviewPanel();

  // const {
  //   bulkImportPositionAssignments,
  //   downloadPositionAssignmentTemplate,
  //   loadPositionData,
  //   selectedPosition,
  // } = useAssignPositions()

  // useEffect(() => {
  //   initData();
  // }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePanelName, setDeletePanelName] = useState("");
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showPositionImportModal, setShowPositionImportModal] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const { t } = useTranslation(["interviewPanelCommittee", "common"]);
  return (
    <div className="interview-panel-container">
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h2>{t("interviewPanelCommittee:committee_management")}</h2>
            <span className="page-subtitle"> {t("interviewPanelCommittee:committee_subtitle")}</span>
          </div>
          <div className="tabs-container">
            <div className="tabs">

              {/* <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowBulkImportModal(true)}
                className="d-flex align-items-center gap-2 bulk-import-btn"
              >
                <FiUpload />
                {t("interviewPanelCommittee:add_panels")}
              </Button>
              <Button variant="outline-primary"
                size="sm"
                onClick={() => {
                  setShowPositionImportModal(true);
                }}
                className="d-flex align-items-center gap-2 bulk-import-btn"
              >
                <FiUpload />
                {t("interviewPanelCommittee:add_position_assignments")}
              </Button> */}

              <button
                className={`tab ${activeTab === "MANAGE" ? "active" : ""}`}
                onClick={() => setActiveTab("MANAGE")}
              >
                <FiUsers className="tab-icon" />
                <span>{t("interviewPanelCommittee:manage_panels")}</span>
              </button>
              <button
                className={`tab ${activeTab === "ASSIGN" ? "active" : ""}`}
                onClick={() => setActiveTab("ASSIGN")}
              >
                <FiFileText className="tab-icon" />
                <span>{t("interviewPanelCommittee:assign_to_positions")}</span>
              </button>
            </div>
          </div>
        </div>


        <div className="guidelines-box mt-3">
          {/* <div className="guidelines-header">
          <img
            src={bulbIcon}
            alt="Info"
            className="bulb-icon"
          />
          <h5 className="guidelines-title">Guidelines</h5>
        </div> */}
          <div
            className="guidelines-header"
            style={{ cursor: "pointer" }}
            onClick={() => setShowGuidelines(prev => !prev)}
          >
            <OverlayTrigger
              placement="bottom"
             
              overlay={
                <Tooltip>
                  Click to expand the guidelines for adding panels and position assignments via Excel templates.
                </Tooltip>
              }
            >
              <div className="d-flex align-items-center gap-2">
                <img src={bulbIcon} alt="Info" className="bulb-icon" />
                <h5 className="guidelines-title mb-0">
                  Guidelines for Bulk upload {showGuidelines ? "▲" : "▼"}
                </h5>
              </div>
            </OverlayTrigger>
          </div>

          {/* ADD PANELS */}
          {showGuidelines && (
            <>
              <div className="guideline-section">
                <h6 className="sectiontitle">Add Panels</h6>

                <ol className="main-list">
                  <li>Click on <b>Manage Panels</b> there we have <b>Bulk Import</b> to create new panels.</li>

                  <li>
                    In the <b>Panel Sheet:</b>
                    <ul>
                      <li>Enter the <b>Panel Number</b> and <b>Panel Name</b>.</li>
                      <li>
                        Select the panel type under the <b>Committee Name</b> column
                        (Screening, Interview, or Compensation).
                      </li>
                    </ul>
                  </li>

                  <li>
                    In the <b>Panel Member Sheet:</b>
                    <ul>
                      <li>Enter the <b>Panel Number</b> (as defined in the Panel Sheet).</li>
                      <li>Select and assign users to the panel.</li>
                      <li>Use additional rows to add multiple users to the same panel.</li>
                    </ul>
                  </li>

                  <li>Save the Excel file and upload it to the system.</li>
                </ol>
              </div>


              <hr />

              {/* ADD POSITION ASSIGNMENTS */}
              <div className="guideline-section">
                <h6 className="sectiontitle">Add Position Assignments</h6>

                <ol className="main-list">
                  <li>
                    Click on <b>Assign to Positions</b> there you will have the <b>Bulk Import</b> to map panels to specific positions.
                  </li>
                  <li>Select the required <b>Requisition/Position</b>.</li>
                  <li>Choose the relevant <b>existing/created panel(s)</b>.</li>
                  <li>Enter the <b>Start Date</b> and <b>End Date</b>.</li>
                  <li>Save the Excel file and upload it to the system.</li>
                </ol>
              </div>
            </>
          )}
        </div>

        <div className="panel-content">
          {activeTab === "MANAGE" && (
            <div className="panel-layout">
              <div className="panel-form-section">
                <div className="panel-form-card">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="card-title">{formData.id
                      ? t("interviewPanelCommittee:update_panel_title")
                      : t("interviewPanelCommittee:create_panel_title")}
                      <p className="card-subtitle">{t("interviewPanelCommittee:subtitle")}</p>
                    </span>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowBulkImportModal(true)}
                      className="d-flex align-items-center gap-2 bulk-import-btn"
                    >
                      <FiUpload />
                      {t("interviewPanelCommittee:bulk_import")}
                    </Button>
                  </div>

                  <InterviewPanelFormModal
                    communityOptions={communityOptions}
                    membersOptions={membersOptions}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                    errors={errors}
                    setErrors={setErrors}
                    clearError={clearError}
                  />
                </div>
              </div>
              <div className="panel-table-section">
                <div className="panel-table-card">
                  <InterviewPanelTable
                    panels={panels}
                    loading={loading}
                    onEdit={handleEdit}
                    //onDelete={handleDelete}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    search={search}
                    setSearch={setSearch}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    // sortConfig={sortConfig}
                    // handleSort={handleSort}
                    // sortedPanels={sortedPanels}
                    size={size}
                    setSize={setSize}
                    onDelete={(id, panelName) => {
                      setDeleteId(id);
                      setDeletePanelName(panelName);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "ASSIGN" && (
            <div className="assign-positions-container">
             <AssignPositionsPage refreshPanels={fetchPanels} />
            </div>
          )}
        </div>

        {/* {activeTab === "ASSIGN" && (
          <div className="assign-positions-container">
            <AssignPositionsPage />
          </div>
        )} */}

        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
            setDeletePanelName("");
          }}
          onConfirm={() => {
            handleDelete(deleteId);
            setShowDeleteModal(false);
            setDeleteId(null);
            setDeletePanelName("");
          }}
          title={t("interviewPanelCommittee:confirm_delete")}
          message={t("interviewPanelCommittee:delete_panel_message")}
          itemLabel={deletePanelName}
        />


      </div>
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        errors={[]}   // no list needed here
        onClose={() => setShowErrorModal(false)}
      />

      <Modal
        show={showBulkImportModal}
        onHide={() => setShowBulkImportModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="header-title">{t("interviewPanelCommittee:bulk_import_panels")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PanelImportModal
            t={t}
            onClose={() => setShowBulkImportModal(false)}
            onSuccess={() => {
              fetchPanels();
              setShowBulkImportModal(false);
            }}
          />
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default InterviewPanelPage;
