import { requiredField, minLength, maxLength } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */
const normalize = (v = "") => String(v).trim().toLowerCase();

/* =========================
   FIELD VALIDATIONS
========================= */

/**
 * validateTitle
 * - required
 * - length limits
 * - uniqueness (case-insensitive)
 */
export const validateTitle = (title, options = {}) => {
  const { existing = [], currentId = null } = options;

  let error = requiredField(title);
  if (error) return error;

  error = minLength(title, 2);
  if (error) return error;

  error = maxLength(title, 100);
  if (error) return error;

  const titleNorm = normalize(title);
  const duplicate = existing.find((it) => {
    if (!it?.title) return false;
    if (currentId != null && it.id === currentId) return false;
    return normalize(it.title) === titleNorm;
  });

  if (duplicate) {
    return i18n.t("validation:duplicate");
  }

  return null;
};

/**
 * validateDepartmentName
 * - required
 * - max length
 */
export const validateDepartmentName = (department) => {
  let error = requiredField(department);
  if (error) return error;

  error = maxLength(department, 100);
  if (error) return error;

  return null;
};

/**
 * validateJobGrade
 * - required
 * - max length
 */
export const validateJobGrade = (jobGrade) => {
  let error = requiredField(jobGrade);
  if (error) return error;

  error = maxLength(jobGrade, 20);
  if (error) return error;

  return null;
};

/**
 * validateDescription
 * - optional
 * - max length
 */
export const validateDescription = (description) => {
  if (!description || String(description).trim() === "") return null;

  const error = maxLength(description, 500);
  if (error) return error;

  return null;
};

/* =========================
   FORM VALIDATION
========================= */

export const validatePositionForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  /* ---- TITLE ---- */
  const titleErr = validateTitle(formData.title, {
    existing,
    currentId
  });
  if (titleErr) errors.title = titleErr;

  /* ---- DEPARTMENT ---- */
  const deptErr = validateDepartmentName(formData.department);
  if (deptErr) errors.department = deptErr;

  /* ---- JOB GRADE ---- */
  const gradeErr = validateJobGrade(formData.jobGrade);
  if (gradeErr) errors.jobGrade = gradeErr;

  /* ---- DESCRIPTION ---- */
  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/* =========================
   DEFAULT EXPORT
========================= */

export default {
  validateTitle,
  validateDepartmentName,
  validateJobGrade,
  validateDescription,
  validatePositionForm
};
