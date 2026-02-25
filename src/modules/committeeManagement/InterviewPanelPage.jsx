import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage";
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";
import { FiUsers, FiFileText } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ErrorModal from "./components/ErrorModal";
import { useTranslation } from "react-i18next";

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
    errorMessage
  } = useInterviewPanel();

  // useEffect(() => {
  //   initData();
  // }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePanelName, setDeletePanelName] = useState("");
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

        <div className="panel-content">
          {activeTab === "MANAGE" && (
            <div className="panel-layout">
              <div className="panel-form-section">
                <div className="panel-form-card">

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
              <AssignPositionsPage />
            </div>
          )}
        </div>

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
    </div>
  );
};

export default InterviewPanelPage;
