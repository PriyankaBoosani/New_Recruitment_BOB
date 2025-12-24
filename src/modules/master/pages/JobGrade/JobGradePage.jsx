// src/modules/master/pages/JobGrade/JobGradePage.jsx

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useJobGrades } from './hooks/useJobGrades';
import JobGradeTable from './components/JobGradeTable';
import JobGradeFormModal from './components/JobGradeFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { validateJobGradeForm } from '../../../../shared/utils/jobgrade-validations';
import { mapJobGradeToApi } from './mappers/jobGradeMapper';
import { importFromCSV } from '../../../../shared/components/FileUpload';

const JobGradePage = () => {
  const { t } = useTranslation(["jobGrade", "validation"]);

  const {
    jobGrades,
    addJobGrade,
    updateJobGrade,
    deleteJobGrade,
    fetchJobGrades,
  } = useJobGrades();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  const [formData, setFormData] = useState({
    scale: '',
    gradeCode: '',
    minSalary: '',
    maxSalary: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

 const openAddModal = () => {
  setIsEditing(false);
  setFormData({
    scale: '',
    gradeCode: '',
    minSalary: '',
    maxSalary: '',
    description: ''
  });
  setErrors({});              // ✅ CLEAR OLD ERRORS
  setActiveTab('manual');
  setShowAddModal(true);
};

  // const openEditModal = (row) => {

  //   setIsEditing(true);
  //   setEditingId(row.id);
  //   setFormData(row);
  //   setActiveTab('manual');
  //   setShowAddModal(true);
  // };

  const openEditModal = (row) => {
  setIsEditing(true);
  setEditingId(row.id);
  setFormData({
    scale: row.scale ?? '',
    gradeCode: row.gradeCode ?? '',
    minSalary: row.minSalary ?? '',
    maxSalary: row.maxSalary ?? '',
    description: row.description ?? ''
  });
  setErrors({});              // ✅ CLEAR OLD ERRORS
  setActiveTab('manual');
  setShowAddModal(true);
};


  const handleSave = async (e) => {
    e.preventDefault();

    const { valid, errors: vErrors } = validateJobGradeForm(
      formData,
      { existing: jobGrades, currentId: isEditing ? editingId : null }
    );

    if (!valid) return setErrors(vErrors);

    const payload = mapJobGradeToApi(formData);

    if (isEditing) {
      await updateJobGrade(editingId, payload);
    } else {
      await addJobGrade(payload);
      setCurrentPage(1);
    }

    setShowAddModal(false);
  };

  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: jobGrades,
      mapRow: (row) => ({
        scale: (row.scale || '').trim(),
        gradeCode: (row.gradeCode || row.grade_code || '').trim(),
        minSalary: row.minSalary || row.min_salary,
        maxSalary: row.maxSalary || row.max_salary,
        description: (row.description || '').trim(),
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab,
      setList: fetchJobGrades
    });
  };

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("jobGrade:title")}</h2>

        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              placeholder={t("jobGrade:search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <Button className="add-button" onClick={openAddModal}>
            <Plus size={20} /> {t("jobGrade:add")}
          </Button>
        </div>
      </div>

      <JobGradeTable
        data={jobGrades}
        searchTerm={searchTerm}
        onEdit={openEditModal}
        onDelete={(row) => { setDeleteTarget(row); setShowDeleteModal(true); }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <JobGradeFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        errors={errors}
        handleInputChange={(e) => {
          const { name, value } = e.target;

          setFormData(prev => ({
            ...prev,
            [name]: value
          }));

          // ✅ clear error for this field only
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }}
        handleSave={handleSave}
        handleImport={handleImport}
        selectedCSVFile={selectedCSVFile}
        onSelectCSV={setSelectedCSVFile}
        removeCSV={() => setSelectedCSVFile(null)}
        t={t}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        target={deleteTarget}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteJobGrade(deleteTarget.id);
          setShowDeleteModal(false);
        }}
      />
    </Container>
  );
};

export default JobGradePage;
