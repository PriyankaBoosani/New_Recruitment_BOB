// src/modules/master/pages/Category/components/CategoryFormModal.jsx

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import { validateCategoryForm } from "../../../../../shared/utils/category-validations";
import CategoryImportModal from "./CategoryImportModal";

const CategoryFormModal = ({
  show,
  onHide,
  isEditing,
  editingCategory,
  onSave,
  onUpdate,
  onImport,

  // ✅ IMPORTANT: pass categories list from parent
  categories = []
}) => {
  const { t } = useTranslation(["category"]);

  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  /* ---------------- LOAD EDIT DATA ---------------- */
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        code: editingCategory.code || "",
        name: editingCategory.name || "",
        description: editingCategory.description || ""
      });
    } else {
      setFormData({ code: "", name: "", description: "" });
    }

    setErrors({});
    setActiveTab("manual");
  }, [editingCategory, show]);
  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // ✅ clear error for this field only
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  }
};


  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('isEditing:', isEditing);
    console.log('editingCategory:', editingCategory);
    console.log('categories:', categories);
    const { valid, errors: vErrors } = validateCategoryForm(formData, {
      existing: categories,
      currentId: isEditing ? editingCategory?.id : null   // 🔥 THIS LINE FIXES IT
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    if (isEditing) {
      onUpdate(editingCategory.id, formData);
    } else {
      onSave(formData);
    }

    onHide();
  };


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="user-modal"
    >
      {/* ---------------- HEADER ---------------- */}
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isEditing ? t("edit_category") : t("add_category")}
          </Modal.Title>

          {!isEditing && (
            <p className="mb-0 small text-muted">
              {t("choose_add_method")}
            </p>
          )}
        </div>
      </Modal.Header>

      {/* ---------------- BODY ---------------- */}
      <Modal.Body className="p-4">
        {/* -------- Tabs (Add Only) -------- */}
        {!isEditing && (
          <div className="tab-buttons mb-4">
            <Button
              variant={activeTab === "manual" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "manual" ? "active" : ""
                }`}
              onClick={() => setActiveTab("manual")}
            >
              {t("manual_entry")}
            </Button>

            <Button
              variant={activeTab === "import" ? "light" : "outline-light"}
              className={`tab-button ${activeTab === "import" ? "active" : ""
                }`}
              onClick={() => setActiveTab("import")}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {/* -------- MANUAL ENTRY -------- */}
        {activeTab === "manual" ? (
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>
                  {t("code")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="code"
                  value={formData.code}
                  placeholder={t("enter_code")}
                  onChange={handleInputChange}

                  className="form-control-custom"
                />
                <ErrorMessage>{errors.code}</ErrorMessage>
              </Col>

              <Col md={6}>
                <Form.Label>
                  {t("name")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  placeholder={t("enter_name")}
                  onChange={handleInputChange}

                  className="form-control-custom"
                />
                <ErrorMessage>{errors.name}</ErrorMessage>
              </Col>

              <Col md={12}>
                <Form.Label>
                  {t("description")}{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  placeholder={t("enter_description")}
                  onChange={handleInputChange}

                  className="form-control-custom"
                />
                <ErrorMessage>{errors.description}</ErrorMessage>
              </Col>
            </Row>

            <Modal.Footer className="px-0 pt-4 modal-footer-custom">
              <Button variant="outline-secondary" onClick={onHide}>
                {t("cancel")}
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? t("update") : t("save")}
              </Button>
            </Modal.Footer>
          </Form>
        ) : (
          /* -------- IMPORT TAB -------- */
          <CategoryImportModal onImport={onImport} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CategoryFormModal;
