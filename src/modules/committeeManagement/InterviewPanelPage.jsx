import { useState, useEffect } from "react";
import InterviewPanelFormModal from "./components/InterviewPanelFormModal";
import InterviewPanelTable from "./components/InterviewPanelTable";
import AssignPositionsPage from "./AssignPositionsPage";
import "../../style/css/InterviewPanelPage.css";
import { useInterviewPanel } from "./hooks/useInterviewPanel";
import { FiUsers, FiFileText } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

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
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [deletePanelName, setDeletePanelName] = useState("");
  return (
    <div className="interview-panel-container">
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h2>Committee Management</h2>
            <span className="page-subtitle">Manage interview panels and assign them to positions</span>
          </div>
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
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    sortedPanels={sortedPanels}
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

              {/* <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this interview panel?
          
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              handleDelete(deleteId);
              setShowDeleteModal(false);
              setDeleteId(null);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
        </Modal> */}
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
          title="Confirm Delete"
          message="Are you sure you want to delete this panel?"
          itemLabel={deletePanelName}
        />


      </div>
    </div>
  );
};

export default InterviewPanelPage;
