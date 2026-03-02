import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import { validateUserForm } from "../../../../../shared/utils/user-validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import UserImportModal from "./UserImportModal";

import { handleValidatedInput, INPUT_PATTERNS } from "../../../../../shared/utils/inputHandlers";

const EMPTY_FORM = {
  role: "",
  fullName: "",
  email: "",
  // password: "",
  // confirmPassword: "",
   interviewCentreId: ""
};

const UserFormModal = ({ show, onHide, onSave, mode,selectedUser,existingUsers = [],interviewCentres = [],fetchUsers,
  bulkAddUsers,
  downloadUserTemplate,
  loading}) => {
  const { t } = useTranslation(["user", "validation"]);

  console.log("selectedUser",selectedUser);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  /* ========================= RESET FORM ON OPEN  ========================= */
  // useEffect(() => {
  //   if (show) {
  //     setFormData(EMPTY_FORM);
  //     setErrors({});
  //     setActiveTab("manual"); // reset to manual
  //   }
  // }, [show]);
useEffect(() => {
  if (!show) return;

  setErrors({});
  setActiveTab("manual");

  if (mode === "edit" || mode === "view") {
    setFormData({
      role: selectedUser?.role || "",
      fullName: selectedUser?.name || "",
      email: selectedUser?.email || "",
      interviewCentreId: selectedUser?.interviewCentreId || ""
    });
  } else {
    setFormData(EMPTY_FORM);
  }

}, [show, mode, selectedUser]);
  /* ========================= INPUT HANDLER ========================= */
 const handleInputChange = (e) => {
  const { name, value } = e.target;

  setErrors(prev => {
    const copy = { ...prev };
    if (copy[name]) delete copy[name];
    return copy;
  });

  setFormData(prev => {
    let updated = { ...prev, [name]: value };

    // ✅ CLEAR centre when role changes
    if (name === "role") {
      if (value !== "Zonal_HR") {
        updated.interviewCentreId = "";
      }
    }

    return updated;
  });
};


  /* ========================= SUBMIT ========================= */
 const handleSubmit = (e) => {
  e.preventDefault();

  const { valid, errors: vErrors } = validateUserForm(formData, {
    existing: existingUsers,
    currentId: selectedUser?.userId, // 🔥 important
    skipEmailCheck: mode === "edit"  
  });

  if (!valid) {
    setErrors(vErrors);
    return;
  }

  onSave(formData);
};



  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
       <Modal.Title>
          {mode === "view"
            ? t("viewUser")
            : mode === "edit"
            ? t("editUser")
            : t("addUser")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">

        {/* Manual / Import Tabs */}
        {mode === "add" && (
<div className="tab-buttons mb-4">
  <Button
    className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
    variant={activeTab === "manual" ? "light" : "outline-light"}
    onClick={() => setActiveTab("manual")}
  >
    {t("manual_entry")}
  </Button>

  <Button
    className={`tab-button ${activeTab === "import" ? "active" : ""}`}
    variant={activeTab === "import" ? "light" : "outline-light"}
    onClick={() => setActiveTab("import")}
  >
    {t("import_file")}
  </Button>
</div>
)}
{activeTab === "manual" ? (
  <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>
                {t("role")} <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={mode === "view"}
              >
                <option value="">{t("select_role")}</option>
                <option value="Admin">{t("admin")}</option>
                <option value="Zonal_HR">{t("zonal Hr")}</option>
                <option value="Recruiter">{t("recruiter")}</option>
                <option value="Committee_Member">{t("Committee Member")}</option>
              </Form.Select>
              <ErrorMessage>{errors.role}</ErrorMessage>
            </Col>


            {/* <Col md={6}>
                <Form.Label>
                   {t("role")} <span className="text-danger">*</span>
                </Form.Label>

                <Form.Select
                  name="role"
                   value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>

                  {roles.map((role) => (
                    <option
                      key={role.roleName}
                      value={role.roleName}
                    >
                      {role.roleName}
                    </option>
                  ))}
                </Form.Select>

                <ErrorMessage>{errors.role}</ErrorMessage>
              </Col> */}

            <Col md={6}>
              <Form.Label>
                {t("fullName")} <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                name="fullName"
                value={formData.fullName}
                 disabled={mode === "view"}
                onChange={(e) =>
                  handleValidatedInput({
                    e,
                    fieldName: "fullName",
                    setErrors,
                    pattern: INPUT_PATTERNS.ALPHA_SPACE,
                    errorMessage: t("validation:no_special_chars"),
                    onValidChange: (value) =>
                      handleInputChange({
                        target: { name: "fullName", value }
                      })
                  })
                }
              />
              <ErrorMessage>{errors.fullName}</ErrorMessage>
            </Col>


            <Col md={6}>
              <Form.Label>
                {t("email")} <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={mode === "view" || mode === "edit"}
              />
              <ErrorMessage>{errors.email}</ErrorMessage>
            </Col>


            {formData.role === "Zonal_HR" && (
              <Col md={6}>
                <Form.Label>
                  Interview Centre <span className="text-danger">*</span>
                </Form.Label>

                <Form.Select
                  name="interviewCentreId"
                  value={formData.interviewCentreId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Interview Centre</option>

                  {interviewCentres.map((centre) => (
                    <option
                      key={centre.interviewCentreId}
                      value={centre.interviewCentreId}
                    >
                      {centre.interviewCentre}
                    </option>
                  ))}
                </Form.Select>

                <ErrorMessage>{errors.interviewCentreId}</ErrorMessage>
              </Col>
            )}

            {/* <Col md={6}>
              <Form.Label>
                {t("password")} <span className="text-danger">*</span>
              </Form.Label>


              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pe-5"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </span>
              </div>

              <ErrorMessage>{errors.password}</ErrorMessage>
            </Col>

            <Col md={6}>
              <Form.Label>
                {t("confirmPassword")} <span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pe-5"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </span>
              </div>

              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            </Col> */}

          </Row>

          <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">

            {/* View Mode */}
            {mode === "view" ? (
              <Button variant="outline-secondary" onClick={onHide}>
                {t("close")}
              </Button>
            ) : (
              <>
                <Button variant="outline-secondary" onClick={onHide}>
                  {t("cancel")}
                </Button>

                <Button variant="primary" type="submit">
                  {mode === "edit" ? t("update") : t("save")}
                </Button>
              </>
            )}

          </Modal.Footer>
        </Form>
        ) : (
              <UserImportModal
               onClose={onHide}
               bulkAddUsers={bulkAddUsers}
               downloadUserTemplate={downloadUserTemplate}
               loading={loading}
                t={t}
              />
            )}
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;
