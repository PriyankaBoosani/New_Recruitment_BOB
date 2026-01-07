import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useGenericOrAnnexures } from "./hooks/useGenericOrAnnexures";
import GenericOrAnnexuresTable from "./components/GenericOrAnnexuresTable";
import GenericOrAnnexuresFormModal from "./components/GenericOrAnnexuresFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import {
  validateGenericOrAnnexuresForm
} from "../../../../shared/utils/genericOrAnnexures-validations";

const GenericOrAnnexuresPage = () => {
  const { t } = useTranslation(["genericOrAnnexures"]);

  const {
    items,
    addItem,
    deleteItem
  } = useGenericOrAnnexures();

  /* ================= STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);


  const [formData, setFormData] = useState({
    type: "",
    file: null
  });

  const [errors, setErrors] = useState({});

  /* ================= INPUT CHANGE ================= */
const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]:
      name === "file"
        ? files?.[0] ?? value ?? null
        : value
  }));

  // ❗ DO NOT auto-clear file errors here
  if (name !== "file") {
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  }
};



  /* ================= ADD ================= */
  const openAdd = () => {
    setIsViewing(false);
    setFormData({ type: "", file: null });
    setErrors({});
    setShowModal(true);
  };

  /* ================= VIEW ================= */
  const openView = (item) => {
    setIsViewing(true);
    setFormData({
      type: item.type,
      file: { name: item.fileName }

    });
    setShowModal(true);
  };

  /* ================= SAVE (ADD ONLY) ================= */
  const handleSave = (e) => {
    e.preventDefault();

    const { valid, errors } = validateGenericOrAnnexuresForm(formData);

    if (!valid) {
      setErrors(errors);
      return;
    }

    addItem(formData);

    // ✅ TOAST (EN + HI)
    toast.success(
      t("add_success", "File added successfully")
    );

    setShowModal(false);
  };

  /* ================= DOWNLOAD ================= */
 const handleDownload = (item) => {
  if (!item?.fileUrl) return;

  const a = document.createElement("a");
  a.href = item.fileUrl;
  a.download = item.fileName;
  a.target = "_blank";
  a.click();
};


  /* ================= DELETE ================= */
  const openDeleteConfirm = (item) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem(deleteTarget.id);

    // ✅ TOAST (EN + HI)
    toast.success(
      t("delete_success", "File deleted successfully")
    );

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <Container fluid className="user-container">
      {/* ===== HEADER ===== */}
      <div className="user-header d-flex justify-content-between">
        <h2>{t("title", "Generic / Annexures")}</h2>

        <Button className="add-button" onClick={openAdd}>
          <Plus size={20} /> {t("add", "Add")}
        </Button>
      </div>

      {/* ===== TABLE ===== */}
    <GenericOrAnnexuresTable
  data={items}
  onView={openView}
  onDownload={handleDownload}
  onDelete={openDeleteConfirm}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
/>


      {/* ===== ADD / VIEW MODAL ===== */}
      <GenericOrAnnexuresFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        isViewing={isViewing}
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
         setErrors={setErrors} 
        handleSave={handleSave}
      />

      {/* ===== DELETE CONFIRM MODAL ===== */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        target={{
          name: deleteTarget?.file?.name || "-"
        }}
      />
    </Container>
  );
};

export default GenericOrAnnexuresPage;
