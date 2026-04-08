import { requiredField } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */

const normalize = (v = "") => String(v).trim().toLowerCase();

const validText = (value) =>
  /^[A-Za-z\s.&,()\-_/]+$/.test(value);

/* =========================
   FIELD VALIDATIONS
========================= */

export const validateEducationLevel = (value) => {
  return requiredField(value) || null;
};

export const validateCourse = (value) => {
  let error = requiredField(value);
  if (error) return error;

  if (!validText(value)) {
    return i18n.t("education:invalid_characters", "Invalid characters");
  }

  return null;
};

// ✅ UPDATED SPECIALIZATION VALIDATION
export const validateSpecialization = (list = []) => {
  const seen = new Set();

  for (let val of list) {
    const normalized = normalize(val);

    // skip empty values
    if (!normalized) continue;

    // ❌ invalid characters
    if (!validText(val)) {
      return i18n.t("education:invalid_characters", "Invalid characters");
    }

    // ❌ duplicate specialization
    if (seen.has(normalized)) {
      return i18n.t(
        "education:duplicate_specialization",
        "Duplicate specialization"
      );
    }

    seen.add(normalized);
  }

  return null;
};

/* =========================
   FORM VALIDATION
========================= */

export const validateEducationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // ✅ Education Level
  const eduError = validateEducationLevel(formData.educationLevel);
  if (eduError) errors.educationLevel = eduError;

  // ✅ Course (NO DUPLICATE CHECK NOW)
  const courseError = validateCourse(formData.course);
  if (courseError) errors.course = courseError;

  // ✅ Specialization (WITH DUPLICATE CHECK)
  const specError = validateSpecialization(
    formData.specializationOthers || []
  );
  if (specError) errors.specialization = specError;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/* =========================
   DEFAULT EXPORT
========================= */

const educationValidations = {
  validateEducationForm,
  validateEducationLevel,
  validateCourse,
  validateSpecialization,
};

export default educationValidations;