// src/modules/master/pages/Document/DocumentPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useDocuments } from './hooks/useDocuments';
import DocumentTable from './components/DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { validateDocumentForm } from '../../../../shared/utils/document-validations';
import { mapDocumentToApi } from './mappers/documentMapper';
import { importFromCSV } from '../../../../shared/components/FileUpload';

const DocumentPage = () => {
  const { t } = useTranslation(["documents", "validation"]);

  const {
    documents,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument
  } = useDocuments();

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual');

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  /* ---------- handlers ---------- */

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const openEditModal = (doc) => {
    setIsEditing(true);
    setEditingId(doc.id);
    setFormData({ name: doc.name, description: doc.description });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      name: String(formData.name || '').trim(),
      description: String(formData.description || '').trim()
    };

    const { valid, errors: vErrors } = validateDocumentForm(payload, {
      existing: documents,
      currentId: isEditing ? editingId : null
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    const apiPayload = mapDocumentToApi(payload);

    if (isEditing) {
      await updateDocument(editingId, apiPayload);
    } else {
      await addDocument(apiPayload);
      setCurrentPage(1);
    }

    setShowAddModal(false);
  };

  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: documents,
      mapRow: (row) => ({
        name: (row.name || row.document_name || '').trim(),
        description: (row.description || '').trim()
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab,
      setList: fetchDocuments
    });
  };

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("documents:title")}</h2>

        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              placeholder={t("documents:search_placeholder")}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <Button className="add-button" onClick={openAddModal}>
            <Plus size={20} /> {t("documents:add")}
          </Button>
        </div>
      </div>

      <DocumentTable
        data={documents}
        searchTerm={searchTerm}
        onEdit={openEditModal}
        onDelete={(d) => { setDeleteTarget(d); setShowDeleteModal(true); }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <DocumentFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        handleSave={handleSave}
        handleImport={handleImport}
        selectedCSVFile={selectedCSVFile}
        selectedXLSXFile={selectedXLSXFile}
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
          deleteDocument(deleteTarget.id);
          setShowDeleteModal(false);
        }}
      />
    </Container>
  );
};

export default DocumentPage;
