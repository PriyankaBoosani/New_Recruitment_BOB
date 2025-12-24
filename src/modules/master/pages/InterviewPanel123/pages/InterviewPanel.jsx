// src/modules/interviewPanel/pages/InterviewPanel.jsx
import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useInterviewPanel } from "../hooks/useInterviewPanel";
import PanelTable from "../components/PanelTable";
import PanelFormModal from "../components/PanelFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import '../../../../../style/css/user.css';
const InterviewPanel = () => {
  const {
    panels,
    communityOptions,
    membersOptions,
    loading,
    refreshPanels
  } = useInterviewPanel();

  // UI state only
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);

  const openAdd = () => {
    setSelectedPanel(null);
    setShowFormModal(true);
  };

  const openEdit = (panel) => {
    setSelectedPanel(panel);
    setShowFormModal(true);
  };

  const openDelete = (panel) => {
    setSelectedPanel(panel);
    setShowDeleteModal(true);
  };

  return (
    <Container fluid className="user-container">
      {/* ===== HEADER ===== */}
      <div className="user-header d-flex justify-content-between align-items-center mb-3">
        <h2>Interview Panels</h2>

        <Button variant="primary" onClick={openAdd}>
          <Plus className="me-1" /> Add Panel
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      <PanelTable
        panels={panels}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* ===== ADD / EDIT MODAL ===== */}
      {showFormModal && (
        <PanelFormModal
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          panel={selectedPanel}       // null = add, object = edit
          communityOptions={communityOptions}
          membersOptions={membersOptions}
          onSuccess={() => {
            setShowFormModal(false);
            refreshPanels();
          }}
        />
      )}

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <DeleteConfirmModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          panel={selectedPanel}
          onSuccess={() => {
            setShowDeleteModal(false);
            refreshPanels();
          }}
        />
      )}
    </Container>
  );
};

export default InterviewPanel;
