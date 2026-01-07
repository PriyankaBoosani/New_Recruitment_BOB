// src/modules/master/pages/Position/PositionPage.jsx
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

import { usePositions } from "./hooks/usePositions";
import PositionTable from "./components/PositionTable";
import PositionFormModal from "./components/PositionFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import { validatePositionForm } from "../../../../shared/utils/position-validations";
import { mapPositionToApi } from "./mappers/positionMapper";
import { importFromCSV } from "../../../../shared/components/FileUpload";


import { useDepartments } from "../Department/hooks/useDepartments";
import { useJobGrades } from "../JobGrade/hooks/useJobGrades";


const PositionPage = () => {
  const { t } = useTranslation(["position"]);
  const {
    positions,
    addPosition,
    updatePosition,
    deletePosition, 
    fetchPositions
  } = usePositions();

  /* SAME STATIC DATA AS ORIGINAL */
  // const departments = [
  //   "Information Technology",
  //   "Human Resources",
  //   "Finance",
  //   "Marketing",
  //   "Operations",
  //   "Market Risk",
  //   "Integrated Risk Management",
  // ];

  // const jobGrades = ["JG1", "JG2", "JG3", "JG4"];

  /* ---------------- UI STATE ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState("manual");
  const [isViewing, setIsViewing] = useState(false);


  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    title: "",
    departmentId: "",
    jobGradeId: "",

    mandatoryExperience: "",
    preferredExperience: "",

    mandatoryEducation: "",
    preferredEducation: "",

    rolesResponsibilities: "",

    // eligibility ages used by UI + mapper
    eligibilityAgeMin: "",
    eligibilityAgeMax: ""
  });



  const [errors, setErrors] = useState({});

  /* ---------------- IMPORT STATE ---------------- */
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  /* ---------------- HANDLERS ---------------- */

  const openViewModal = (p) => {
  setIsViewing(true);
  setIsEditing(false);
  setEditingId(p.id);

  setFormData({
    title: p.title || "",
    departmentId: p.departmentId || "",
    jobGradeId: p.jobGradeId || "",
    mandatoryEducation: p.mandatoryEducation || "",
    preferredEducation: p.preferredEducation || "",
    mandatoryExperience: p.mandatoryExperience || "",
    preferredExperience: p.preferredExperience || "",
    rolesResponsibilities: p.rolesResponsibilities || "",
    eligibilityAgeMin: p.eligibilityAgeMin ?? "",
    eligibilityAgeMax: p.eligibilityAgeMax ?? ""
  });

  setErrors({});
  setActiveTab("manual");
  setShowAddModal(true);
};


  const openAddModal = () => {
    setIsEditing(false);
    setShowAddModal(true);
    setEditingId(null);
    setFormData({
      title: "",
      departmentId: "",
      jobGradeId: "",

      mandatoryEducation: "",
      preferredEducation: "",
      mandatoryExperience: "",
      preferredExperience: "",

      rolesResponsibilities: "",
      code: "",
      eligibilityAgeMin: "",
      eligibilityAgeMax: ""
    });
    setErrors({});
    setActiveTab("manual");
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };


  const { departments } = useDepartments();
  const { jobGrades } = useJobGrades();


  const openEditModal = (p) => {
    setIsViewing(false);
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      title: p.title || "",
      departmentId: p.departmentId || "",
      jobGradeId: p.jobGradeId || "",

      mandatoryEducation: p.mandatoryEducation || "",
      preferredEducation: p.preferredEducation || "",
      mandatoryExperience: p.mandatoryExperience || "",
      preferredExperience: p.preferredExperience || "",

      rolesResponsibilities: p.rolesResponsibilities || "",
      code: p.code || "",
      eligibilityAgeMin: p.eligibilityAgeMin ?? "",
      eligibilityAgeMax: p.eligibilityAgeMax ?? ""
    });


    setErrors({});
    setActiveTab("manual");
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { valid, errors: vErrors } = validatePositionForm(formData, {
      existing: positions,
      currentId: isEditing ? editingId : null,
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    // ✅ IMPORTANT: formData MUST contain departmentId & jobGradeId
    const payload = mapPositionToApi(
      { ...formData, id: editingId },
      isEditing
    );


    if (isEditing) {
      await updatePosition(editingId, payload);
    } else {
      await addPosition(payload);
      setCurrentPage(1); // newest on top
    }

    setShowAddModal(false);
  };


  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: positions,
      mapRow: (row) => {
        const dept = departments.find(
          d => d.name.toLowerCase() === String(row.department).toLowerCase()
        );

        const grade = jobGrades.find(
          g => g.code.toLowerCase() === String(row.jobGrade).toLowerCase()
        );

        return {
          title: (row.title || row.positionTitle || "").trim(),
          description: (row.description || "").trim(),
          departmentId: dept?.id || "",
          jobGradeId: grade?.id || "",
          code: row.positionCode || "",
          // accept multiple common CSV headers for ages
          eligibilityAgeMin: (row.eligibilityAgeMin || row.minAge || row.min_age || "").toString(),
          eligibilityAgeMax: (row.eligibilityAgeMax || row.maxAge || row.max_age || "").toString()
        };
      },
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab,
    });
  };


  /* ---------------- RENDER ---------------- */

  return (
    <Container fluid className="user-container">
      <div className="user-header">
        <h2>{t("positions")}</h2>

        <div className="user-actions">
          {/* ✅ SEARCH BAR – SAME AS DEPARTMENT */}
          <div className="search-box">
            <Search className="search-icon" />
         <Form.Control
  placeholder={t("search_placeholder")}
  value={searchTerm}
  className="search-input"
  onChange={(e) => {
    const value = e.target.value;

    // ✅ allow alphabets, numbers, space and @
    if (!/^[A-Za-z0-9@\s]*$/.test(value)) {
      return; // block invalid characters
    }

    setSearchTerm(value);
  }}
/>

          </div>

          <Button className="add-button" onClick={openAddModal}>
            <Plus size={20} /> {t("add")}
          </Button>
        </div>
      </div>

      <PositionTable
        data={positions}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={(p) => {
          setDeleteTarget(p);
          setShowDeleteModal(true);
        }}
        t={t}
      />


      <PositionFormModal
        show={showAddModal}
        
        onHide={() => setShowAddModal(false)}
        isViewing={isViewing} 
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        errors={errors}
         setErrors={setErrors}
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
        departments={departments}
        jobGrades={jobGrades}
        selectedCSVFile={selectedCSVFile}
        selectedXLSXFile={selectedXLSXFile}
        onSelectCSV={setSelectedCSVFile}
        onSelectXLSX={setSelectedXLSXFile}
        removeCSV={() => setSelectedCSVFile(null)}
        removeXLSX={() => setSelectedXLSXFile(null)}
        t={t}
         fetchPositions={fetchPositions}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        target={deleteTarget}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deletePosition(deleteTarget.id);
          setShowDeleteModal(false);
        }}
      />
    </Container>
  );
};

export default PositionPage;
