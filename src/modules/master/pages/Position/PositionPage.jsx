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

  /* ---------------- FORM STATE ---------------- */
const [formData, setFormData] = useState({
  title: "",
  description: "",
  departmentId: "",   // ✅ UUID
  jobGradeId: "",     // ✅ UUID
  code: ""            // optional
});


  const [errors, setErrors] = useState({});

  /* ---------------- IMPORT STATE ---------------- */
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  /* ---------------- HANDLERS ---------------- */

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
setFormData({
  title: "",
  description: "",
  departmentId: "",
  jobGradeId: "",
  code: ""
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
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
  title: p.title || "",
  description: p.description || "",
  departmentId: p.departmentId || "",
  jobGradeId: p.jobGradeId || "",
  code: p.code || ""
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
        code: row.positionCode || ""
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
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
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        errors={errors}
        handleInputChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
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
