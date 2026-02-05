import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage";
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";
import { FiUsers, FiFileText } from "react-icons/fi";

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
    sortConfig,
    handleSort,
    sortedPanels,
    size,
    setSize,
    activeTab,
    setActiveTab
  } = useInterviewPanel();

  // useEffect(() => {
  //   initData();
  // }, []);

  return (
    <div className="interview-panel-container">
      <div className="panel-card">
        <div className="panel-header">
          {/* <h2>Committee Management</h2> */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "MANAGE" ? "active" : ""}`}
                onClick={() => setActiveTab("MANAGE")}
              >
                <FiUsers className="tab-icon" />
                <span>Manage Panels</span>
              </button>
              <button
                className={`tab ${activeTab === "ASSIGN" ? "active" : ""}`}
                onClick={() => setActiveTab("ASSIGN")}
              >
                <FiFileText className="tab-icon" />
                <span>Assign to Positions</span>
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    search={search}
                    setSearch={setSearch}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    sortedPanels={sortedPanels}
                    size={size}
                    setSize={setSize}
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
      </div>
    </div>
  );
};

export default InterviewPanelPage;
