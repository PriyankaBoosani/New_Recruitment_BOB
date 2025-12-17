import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";
import { useDepartments } from './hooks/useDepartments';
import DepartmentTable from './components/DepartmentTable';
import DepartmentFormModal from './components/DepartmentFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { validateDepartmentForm } from '../../../../shared/utils/department-validations';
import { mapDepartmentToApi } from "./mappers/departmentMapper";
import { importFromCSV } from '../../../../shared/components/FileUpload';
import masterApiService from '../../services/masterApiService';
import { toast } from 'react-toastify';

const DepartmentPage = () => {
  const { t } = useTranslation(["department", "validation"]);
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    fetchDepartments,
  } = useDepartments();

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form States
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const openEditModal = (dept) => {
    setIsEditing(true);
    setEditingDeptId(dept.id);
    setFormData({ name: dept.name, description: dept.description || '' });
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { valid, errors: vErrors } =
      validateDepartmentForm(formData, {
        existing: departments,
        currentId: isEditing ? editingDeptId : null
      });

    if (!valid) return setErrors(vErrors);

    try {
      const payload = mapDepartmentToApi(formData);

      if (isEditing) {
        await updateDepartment(editingDeptId, payload);
      } else {
        await addDepartment(payload);
        setCurrentPage(1); // show newest row
      }

      setShowAddModal(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };


  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile, selectedXLSXFile, list: departments,
      mapRow: (row) => ({ name: (row.name || '').trim(), description: (row.description || '').trim() }),
      setSelectedCSVFile, setSelectedXLSXFile, setShowAddModal, setActiveTab, setList: fetchDepartments
    });
  };

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("department:departments")}</h2>
        <div className="user-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              placeholder={t("search_by_department")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <Button className="add-button" onClick={openAddModal}><Plus size={20} /> {t("department:add")}</Button>
        </div>
      </div>

      <DepartmentTable
        data={departments}
        searchTerm={searchTerm}
        onEdit={openEditModal}
        onDelete={(dept) => { setDeleteTarget(dept); setShowDeleteModal(true); }}
        currentPage={currentPage}       // Pass this
        setCurrentPage={setCurrentPage} // Pass this
      />

      <DepartmentFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        errors={errors}
        handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSave}
        handleImport={handleImport}
        selectedCSVFile={selectedCSVFile}
        onSelectCSV={setSelectedCSVFile}
        removeCSV={() => setSelectedCSVFile(null)}
        // ... other props
        t={t}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        target={deleteTarget}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => { deleteDepartment(deleteTarget.id); setShowDeleteModal(false); }}
      />
    </Container>
  );
};

export default DepartmentPage;