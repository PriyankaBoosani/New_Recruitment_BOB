import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useSpecialCategories } from './hooks/useSpecialCategories';
import SpecialCategoryTable from './components/SpecialCategoryTable';
import SpecialCategoryFormModal from './components/SpecialCategoryFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { validateSpecialCategoryForm } from "../../../../shared/utils/specialcategory-validations";
import { mapSpecialCategoryToApi } from './mappers/specialCategoryMapper';
import { importFromCSV } from '../../../../shared/components/FileUpload';

const SpecialCategoryPage = () => {
  const { t } = useTranslation(["specialCategory"]);

  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useSpecialCategories();

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  /* =====================
     ADD
  ====================== */
  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ code: '', name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setShowModal(true);
  };

  /* =====================
     EDIT (IMPORTANT FIX)
  ====================== */
const openEdit = (row) => {
  setIsEditing(true);
  setEditingId(row.id);

  setFormData({
    code: row.code || '',
    name: row.name || '',
    description: row.description || ''
  });

  setErrors({});
  setActiveTab('manual');
  setShowModal(true);
};

  /* =====================
     SAVE
  ====================== */
const handleSave = (e) => {
  e.preventDefault();

  const { valid, errors: vErrors } =
    validateSpecialCategoryForm(formData, {
      existing: categories,
      currentId: isEditing ? editingId : null
    });

  if (!valid) {
    setErrors(vErrors);   // ← this enables error messages
    return;
  }

  setErrors({});

  const payload = mapSpecialCategoryToApi(formData);
  addCategory(payload);

  setShowModal(false);
};


  /* =====================
     IMPORT
  ====================== */
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: categories,
      mapRow: (row) => ({
        code: (row.code ?? '').trim(),
        name: (row.name ?? '').trim(),
        description: (row.description ?? '').trim()
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal: setShowModal,
      setActiveTab,
      setList: fetchCategories
    });
  };

  return (
    <Container fluid className="user-container">
      {/* Header */}
      <div className="user-header">
        <h2>{t("title")}</h2>

        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search_placeholder")}
              className="search-input"
            />
          </div>

          <Button className="add-button" onClick={openAdd}>
            <Plus size={20} /> {t("add")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <SpecialCategoryTable
        data={categories}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEdit={openEdit}
        onDelete={(row) => {
          setDeleteTarget(row);
          setShowDeleteModal(true);
        }}
      />

      {/* Add / Edit Modal */}
      <SpecialCategoryFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
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

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        target={deleteTarget}
        title="Delete Special Category"
        message="Are you sure you want to delete this special category?"
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteCategory(deleteTarget.id);
          setShowDeleteModal(false);
        }}
      />
    </Container>
  );
};

export default SpecialCategoryPage;
