// src/modules/master/pages/InterviewPanel/InterviewPanelPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useInterviewPanels } from './hooks/useInterviewPanels';
import InterviewPanelTable from './components/InterviewPanelTable';
import InterviewPanelFormModal from './components/InterviewPanelFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { validateInterviewPanelForm } from '../../../../shared/utils/interviewpanel-validations';
import { mapInterviewPanelToApi } from './mappers/interviewPanelMapper';
import { importFromCSV } from '../../../../shared/components/FileUpload';

const InterviewPanelPage = () => {
  const { t } = useTranslation(["interviewPanel"]);

  const {
    panels,
    fetchPanels,
    addPanel,
    updatePanel,
    deletePanel,
    membersOptions
  } = useInterviewPanels();

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual');

  const [formData, setFormData] = useState({ name: '', members: [] });
  const [errors, setErrors] = useState({});

  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  /* ---------- handlers ---------- */

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', members: [] });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const openEdit = (panel) => {
    setIsEditing(true);
    setEditingId(panel.id);
    setFormData({
      name: panel.name,
      members: panel.membersArray
    });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const result = validateInterviewPanelForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    const payload = mapInterviewPanelToApi(result.normalized);

    if (isEditing) {
      await updatePanel(editingId, payload);
    } else {
      await addPanel(payload);
      setCurrentPage(1);
    }

    setShowAddModal(false);
  };

  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: panels,
      mapRow: (row) => ({
        name: (row.name || row.panel_name || '').trim(),
        members: (row.members || '').trim()
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab,
      setList: fetchPanels
    });
  };

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("interviewPanel:title")}</h2>

        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              placeholder={t("interviewPanel:search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <Button className="add-button" onClick={openAdd}>
            <Plus size={20} /> {t("interviewPanel:add")}
          </Button>
        </div>
      </div>

      <InterviewPanelTable
        data={panels}
        searchTerm={searchTerm}
        onEdit={openEdit}
        onDelete={(p) => { setDeleteTarget(p); setShowDeleteModal(true); }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <InterviewPanelFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        isEditing={isEditing}
        editingId={editingId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        membersOptions={membersOptions}
        handleSave={handleSave}
        handleImport={handleImport}
        selectedCSVFile={selectedCSVFile}
        onSelectCSV={setSelectedCSVFile}
        onSelectXLSX={setSelectedXLSXFile}
        removeCSV={() => setSelectedCSVFile(null)}
        removeXLSX={() => setSelectedXLSXFile(null)}
        t={t}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        target={deleteTarget}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deletePanel(deleteTarget.id);
          setShowDeleteModal(false);
        }}
      />
    </Container>
  );
};

export default InterviewPanelPage;
