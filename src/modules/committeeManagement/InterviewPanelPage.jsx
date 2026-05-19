import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage";
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";
import { useAssignPositions } from "./hooks/useAssignPositions";
import { FiUsers, FiFileText, FiUpload } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ErrorModal from "./components/ErrorModal";
import PanelImportModal from "./components/PanelImportModal";
import { useTranslation } from "react-i18next";
import PositionAssignmentImportModal from "./components/PositionAssignmentImportModal";
import bulbIcon from "../../assets/bulb-icon.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../../shared/components/Loader";
const InterviewPanelPage = () => {


  const {
    panels,
    loading,
    communityOptions,
    membersOptions,
    //centerOptions,
    formData,
    setFormData,
    errors,
    setErrors,
    // editAssignedMembers,
    // setEditAssignedMembers,

    initData,
    fetchPanels,
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
 savingPanel,
 showUpdateConfirmModal,
setShowUpdateConfirmModal,
continuePanelUpdate

  } = useInterviewPanel();

  // const {
  //   bulkImportPositionAssignments,
  //   downloadPositionAssignmentTemplate,
  //   loadPositionData,
  //   selectedPosition,
  // } = useAssignPositions()

  useEffect(() => {
    initData();
  }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePanelName, setDeletePanelName] = useState("");
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showPositionImportModal, setShowPositionImportModal] = useState(false);
  // const [showGuidelines, setShowGuidelines] = useState(false);

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


        {/* <div className="guidelines-box mt-3">
          <div className="guidelines-header">
            <img
              src={bulbIcon}
              alt="Info"
              className="bulb-icon"
            />
            <h5 className="guidelines-title">{t("interviewPanelCommittee:guidelines")}</h5>
          </div>



          <div className="guideline-section">
            <h6 className="sectiontitle">  {t("interviewPanelCommittee:add_panels_guideline_title")}</h6>

            <ol className="main-list">
              <li>
                {t("interviewPanelCommittee:add_panels_step_1")}{" "}
                <b>{t("interviewPanelCommittee:add_panels_guideline_title")}</b>{" "}
                {t("interviewPanelCommittee:create_new_panels")}
              </li>    <li>
                {t("interviewPanelCommittee:add_panels_step_2")}{" "}
                <b>{t("interviewPanelCommittee:panel_sheet")}</b>
                <ul>
                  <li> {t("interviewPanelCommittee:add_panels_step_2_1")} <b>{t("interviewPanelCommittee:panel_number")}</b> {t("interviewPanelCommittee:and")} <b>{t("interviewPanelCommittee:panel_name")}</b>.</li>
                  <li>
                    {t("interviewPanelCommittee:add_panels_step_2_2")} <b>{t("interviewPanelCommittee:committee_name")}</b> {t("interviewPanelCommittee:column_text")}
                    {" "} {t("interviewPanelCommittee:screening_interview_compensation")}
                  </li>
                </ul>
              </li>

              <li>
                {t("interviewPanelCommittee:add_panels_step_3")}{" "}
                <b>{t("interviewPanelCommittee:panel_member_sheet")}</b>
                <ul>
                  <li>{t("interviewPanelCommittee:add_panels_step_3_1")} <b>{t("interviewPanelCommittee:panel_number")}</b>{" "}{t("interviewPanelCommittee:as_defined_panel_sheet")}</li>
                  <li>{t("interviewPanelCommittee:add_panels_step_3_2")}</li>
                  <li>{t("interviewPanelCommittee:add_panels_step_3_3")}</li>
                </ul>
              </li>

              <li>{t("interviewPanelCommittee:add_panels_step_4")}</li>
            </ol>
          </div>


          <hr />


          <div className="guideline-section">
            <h6 className="sectiontitle">{t("interviewPanelCommittee:add_position_assignments_guideline_title")}</h6>

            <ol className="main-list">
              <li>
                {t("interviewPanelCommittee:add_panels_step_1")}{" "}<b>{t("interviewPanelCommittee:add_position_assignments_guideline_title")}</b> {t("interviewPanelCommittee:map_panels_positions")}
              </li>
              <li> {t("interviewPanelCommittee:position_assignment_step_2")}{" "}<b>{t("interviewPanelCommittee:requisition_position")}</b>.</li>
              <li> {t("interviewPanelCommittee:position_assignment_step_3")}{" "} <b>{t("interviewPanelCommittee:existing_created_panels")}</b>.</li>
              <li>{t("interviewPanelCommittee:position_assignment_step_4")}{" "} <b>{t("interviewPanelCommittee:start_date")}{" "}</b>{t("interviewPanelCommittee:and")}{" "}<b>{t("interviewPanelCommittee:end_date")}</b>.</li>
              <li>{t("interviewPanelCommittee:position_assignment_step_5")}</li>
            </ol>
          </div>

        </div> */}

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
                      // centerOptions={centerOptions}
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
      {(loading || savingPanel) && <Loader />}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        errors={[]}   // no list needed here
        onClose={() => setShowErrorModal(false)}
      />
<Modal
  show={showUpdateConfirmModal}
  onHide={() => setShowUpdateConfirmModal(false)}
  centered
  backdrop="static"
>

  <Modal.Body className="update-confirm-modal-body">

    <div className="update-confirm-icon">
      <i className="bi bi-exclamation-triangle-fill" />
    </div>

    <h5 className="update-confirm-title">
      Scheduled Interviews Found
    </h5>

    <p className="update-confirm-text">
      Some interviews are already scheduled for this panel.

      Continuing the update will notify newly added
      panel members about the scheduled interviews.
    </p>

    <div className="update-confirm-actions">

      <button
        className="btn btn-light"
        onClick={() =>
          setShowUpdateConfirmModal(false)
        }
      >
        Cancel
      </button>

      <button
        className="btn btn-warning text-white"
        onClick={continuePanelUpdate}
      >
        Continue Update
      </button>

    </div>

  </Modal.Body>

</Modal>
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

      {/* <Modal
        show={showPositionImportModal}
        onHide={() => setShowPositionImportModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="header-title">{t("interviewPanelCommittee:bulk_import_position_assignments")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PositionAssignmentImportModal
            t={t}
            bulkImportPositionAssignments={bulkImportPositionAssignments}
            downloadPositionAssignmentTemplate={downloadPositionAssignmentTemplate}
            loading={loading}
            onClose={() => setShowPositionImportModal(false)}
            onSuccess={() => {
              loadPositionData(selectedPosition);
              setShowPositionImportModal(false);
            }}
          />
        </Modal.Body>
      </Modal> */}

    </div>
  );
};

export default InterviewPanelPage;
