import i18n from "i18next";
import {
  requiredField,
  minLength,
  maxLength,
  emailFormat,
  phoneFormat
} from "./common-validations";

/**
 * Normalize a string for comparison (trim + lowercase)
 */
const normalizeString = (str = "") => String(str).trim().toLowerCase();

const onlyAlphabetsAndSpaces = (value) =>
  /^[A-Za-z\s]+$/.test(value);


/* =========================
   FIELD VALIDATIONS
========================= */

export const validateUserRole = (role) => {
  return requiredField(role, i18n.t("validation:role"));
};

export const validateFullName = (name) => {
  let error = requiredField(name, i18n.t("validation:full_name"));
  if (error) return error;

  if (!onlyAlphabetsAndSpaces(name)) {
    return i18n.t("validation:no_special_chars");
  }

  error = minLength(name, 2, i18n.t("validation:full_name"));
  if (error) return error;

  error = maxLength(name, 100, i18n.t("validation:full_name"));
  if (error) return error;

  return null;
};

export const validateUserEmail = (email) => {
  let error = requiredField(email, i18n.t("validation:email"));
  if (error) return error;

  error = emailFormat(email);
  if (error) return error;

  return null;
};



export const validateUserPassword = (password, isRequired = true) => {
  if (!isRequired && !password) return null;

  let error = requiredField(password, i18n.t("validation:password"));
  if (error) return error;

  error = minLength(password, 6, i18n.t("validation:password"));
  if (error) return error;

  return null;
};

export const validatePasswordConfirmation = (confirmPassword, password) => {
  let error = requiredField(password, i18n.t("validation:password"));
  if (error) return error;

  if (!confirmPassword)
    return i18n.t("validation:confirm_password_required");

  if (confirmPassword !== password)
    return i18n.t("validation:passwords_not_match");

  return null;
};

/* =========================
   FORM VALIDATION
========================= */

export const validateUserForm = (formData = {}, options = {}) => {
  const {
    requirePassword = true,
    existing = [],
    currentId = null
  } = options;

  const errors = {};

  // Role
  const roleError = validateUserRole(formData.role);
  if (roleError) errors.role = roleError;

  // Full name
  const nameError = validateFullName(formData.fullName);
  if (nameError) errors.fullName = nameError;

  // Email
  const emailError = validateUserEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  } else {
    const emailNorm = normalizeString(formData.email);
    const duplicateEmail = existing.find(
      (user) =>
        user.email &&
        normalizeString(user.email) === emailNorm &&
        user.id !== currentId
    );

    if (duplicateEmail) {
      errors.email = i18n.t("validation:email_exists");
    }
  }



  // Password + confirm password
  if (requirePassword || formData.password) {
    const passwordError = validateUserPassword(
      formData.password,
      requirePassword
    );

    if (passwordError) {
      errors.password = passwordError;
    } else if (formData.password) {
      const confirmError = validatePasswordConfirmation(
        formData.confirmPassword,
        formData.password
      );
      if (confirmError) {
        errors.confirmPassword = confirmError;
      }
    }
  }

  // Password + confirm password
  if (requirePassword || formData.confirmPassword) {
    const confirmError = validatePasswordConfirmation(
      formData.confirmPassword,
      formData.password
    );
    if (confirmError) {
      errors.confirmPassword = confirmError;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateUserRole,
  validateFullName,
  validateUserEmail,
  validateUserPassword,
  validatePasswordConfirmation,
  validateUserForm
};
