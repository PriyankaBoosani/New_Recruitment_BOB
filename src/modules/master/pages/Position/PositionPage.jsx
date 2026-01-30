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
import '../../../../style/css/user.css';
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

  /* ---------------- UI STATE ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);


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
    jobGradeId: "",
    mandatoryExperience: "",
    preferredExperience: "",
    rolesResponsibilities: "",
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
    setIsViewing(false);
    setShowAddModal(true);
    setEditingId(null);
    setFormData({
      title: "",
      jobGradeId: "",
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
      jobGradeId: p.jobGradeId || "",

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

    // TRIM TEXT FIELDS HERE (single source of truth)
    const cleanedFormData = {
      ...formData,
      title: formData.title?.trim(),
      mandatoryExperience: formData.mandatoryExperience?.trim(),
      preferredExperience: formData.preferredExperience?.trim(),
      rolesResponsibilities: formData.rolesResponsibilities?.trim()
    };

    const { valid, errors: vErrors } = validatePositionForm(cleanedFormData, {
      existing: positions,
      currentId: isEditing ? editingId : null,
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    const payload = mapPositionToApi(
      { ...cleanedFormData, id: editingId },
      isEditing
    );

    if (isEditing) {
      await updatePosition(editingId, payload);
    } else {
      await addPosition(payload);
      setCurrentPage(1);
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
          // departmentId: dept?.id || "",
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
          {/*  SEARCH BAR – SAME AS DEPARTMENT */}
          <div className="search-box">
            <Search className="search-icon" />
            <Form.Control
              placeholder={t("search_placeholder")}
              value={searchTerm}
              className="search-input"
              onChange={(e) => {
                const value = e.target.value;
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
        pageSize={pageSize}
        setPageSize={setPageSize}
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

          //  clear error for this field only
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
