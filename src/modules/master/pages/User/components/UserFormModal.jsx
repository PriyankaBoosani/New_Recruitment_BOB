import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../../../shared/components/ErrorMessage";
import { validateUserForm } from "../../../../../shared/utils/user-validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { handleAlphaSpaceInput } from '../../../../../shared/utils/inputHandlers';



const EMPTY_FORM = {  
  role: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const UserFormModal = ({ show, onHide, onSave, existingUsers = [] }) => {
  const { t } = useTranslation(["user", "validation"]);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =========================
     🔄 RESET FORM ON OPEN
  ========================= */
  useEffect(() => {
    if (show) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [show]);

  /* =========================
     INPUT HANDLER
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { valid, errors: vErrors } = validateUserForm(formData, {
      requirePassword: true,
      existing: existingUsers
    });

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    onSave(formData);
    onHide();
  };


  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>{t("addUser")}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>{t("role")} *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="">{t("select_role")}</option>
                <option value="Admin">{t("admin")}</option>
                <option value="Manager">{t("manager")}</option>
                <option value="Recruiter">{t("recruiter")}</option>
                <option value="Interviewer">{t("interviewer")}</option>
              </Form.Select>
              <ErrorMessage>{errors.role}</ErrorMessage>
            </Col>

       <Col md={6}>
  <Form.Label>{t("fullName")} *</Form.Label>

<Form.Control
  name="fullName"
  value={formData.fullName}
  onChange={(e) =>
    handleAlphaSpaceInput({
      e,
      fieldName: "fullName",
      setFormData,
      setErrors,
      errorMessage: t("validation:no_special_chars")
    })
  }
/>



  <ErrorMessage>{errors.fullName}</ErrorMessage>
</Col>


            <Col md={6}>
              <Form.Label>{t("email")} *</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <ErrorMessage>{errors.email}</ErrorMessage>
            </Col>



            <Col md={6}>
              <Form.Label>{t("password")} *</Form.Label>

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
              <Form.Label>{t("confirmPassword")} *</Form.Label>

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
            </Col>

          </Row>

          <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
            <Button variant="outline-secondary" onClick={onHide}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;
