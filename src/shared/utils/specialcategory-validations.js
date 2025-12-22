import { requiredField, minLength, maxLength } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */
const normalize = (v = "") => String(v).trim().toLowerCase();

/* =========================
   FIELD VALIDATIONS
========================= */

export const validateSpecialCategoryCode = (code) => {
  let error = requiredField(code);
  if (error) return error;

  error = minLength(code, 2);
  if (error) return error;

  error = maxLength(code, 20);
  if (error) return error;

  return null;
};

export const validateSpecialCategoryName = (name) => {
  let error = requiredField(name);
  if (error) return error;

  error = minLength(name, 2);
  if (error) return error;

  error = maxLength(name, 150);
  if (error) return error;

  return null;
};

export const validateSpecialCategoryDescription = (description) => {
  let error = requiredField(description);
  if (error) return error;

  error = minLength(description, 5);
  if (error) return error;

  error = maxLength(description, 500);
  if (error) return error;

  return null;
};

/* =========================
   FORM VALIDATION
========================= */

export const validateSpecialCategoryForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  /* ---- CODE ---- */
  const codeError = validateSpecialCategoryCode(formData.code);
  if (codeError) errors.code = codeError;

  /* ---- NAME ---- */
  const nameError = validateSpecialCategoryName(formData.name);
  if (nameError) errors.name = nameError;

  /* ---- DESCRIPTION ---- */
  const descError = validateSpecialCategoryDescription(formData.description);
  if (descError) errors.description = descError;

  /* =========================
     DUPLICATE CHECKS
  ========================= */

  // Duplicate CODE
  if (!errors.code) {
    const codeNorm = normalize(formData.code);

    const duplicateCode = existing.find((c) => {
      if (!c?.code) return false;
      if (currentId != null && c.id === currentId) return false;
      return normalize(c.code) === codeNorm;
    });

    if (duplicateCode) {
      errors.code = i18n.t("validation:duplicate");
    }
  }

  // Duplicate NAME
  if (!errors.name) {
    const nameNorm = normalize(formData.name);

    const duplicateName = existing.find((c) => {
      if (!c?.name) return false;
      if (currentId != null && c.id === currentId) return false;
      return normalize(c.name) === nameNorm;
    });

    if (duplicateName) {
      errors.name = i18n.t("validation:duplicate");
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/* =========================
   DEFAULT EXPORT
========================= */

export default {
  validateSpecialCategoryForm,
  validateSpecialCategoryCode,
  validateSpecialCategoryName,
  validateSpecialCategoryDescription
};
