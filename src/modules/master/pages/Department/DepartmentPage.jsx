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
  const [isViewing, setIsViewing] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form States
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  

  const openAddModal = () => {
    setIsEditing(false);
    setIsViewing(false);
    setFormData({ name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

const openEditModal = (dept) => {
  setIsEditing(true);
  setIsViewing(false);
  setEditingDeptId(dept.id);
  setFormData({ name: dept.name, description: dept.description || '' });
  setErrors({});                 //  CLEAR OLD ERRORS
  setActiveTab('manual');
  setShowAddModal(true);
};

const openViewModal = (dept) => {
  setIsViewing(true);
  setIsEditing(false);
  setFormData({ name: dept.name, description: dept.description || '' });
  setErrors({});                 //  CLEAR OLD ERRORS
  setActiveTab('manual');  
  setShowAddModal(true);
};


  const handleSave = async (e) => {
  e.preventDefault();

  //  TRIM ALL STRING FIELDS (ltrim + rtrim)
  const trimmedFormData = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value
    ])
  );

  const { valid, errors: vErrors } =
    validateDepartmentForm(trimmedFormData, {
      existing: departments,
      currentId: isEditing ? editingDeptId : null
    });

    
  if (!valid) {
    setErrors(vErrors);
    return;
  }

  try {
    const payload = mapDepartmentToApi(trimmedFormData);

    if (isEditing) {
      await updateDepartment(editingDeptId, payload);
    } else {
      await addDepartment(payload);
      setCurrentPage(1);
    }

    setShowAddModal(false);
  } catch (err) {
    console.error("Save failed", err);
  }
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
  onChange={(e) => {
    const value = e.target.value;

    // //  allow alphabets, numbers, @, and space
    // if (!/^[A-Za-z0-9@\s]*$/.test(value)) {
    //   return; // block invalid characters
    // }

    setSearchTerm(value);
    setCurrentPage(1);
  }}
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
        onView={openViewModal}
        onDelete={(dept) => { setDeleteTarget(dept); setShowDeleteModal(true); }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <DepartmentFormModal
        show={showAddModal}
       onHide={() => {
  setShowAddModal(false);
  setErrors({});                
}}
        isEditing={isEditing}
        isViewing={isViewing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        handleInputChange={(e) => {
          const { name, value } = e.target;

          setFormData(prev => ({
            ...prev,
            [name]: value
          }));

          //  clear error for this field only
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }}

        handleSave={handleSave}
        t={t}

        //  ADD THIS
        onSuccess={() => {
          fetchDepartments();     // refresh list immediately
          setShowAddModal(false); // ensure modal closes
        }}
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