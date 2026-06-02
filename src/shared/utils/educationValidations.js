import { requiredField } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */

const normalize = (v = "") => String(v).trim().toLowerCase();

const validText = (value) => /^[A-Za-z\s.&,()\-_/]+$/.test(value);

const validTextForm = (value) => /^[A-Za-z\s.,&()+/_\-–—]+$/.test(value);

/* =========================
   FIELD VALIDATIONS
========================= */

export const validateEducationLevel = (value) => {
  return requiredField(value) || null;
};

export const validateCourse = (value) => {
  let error = requiredField(value);
  if (error) return error;

  if (!validTextForm(value)) {
    return i18n.t("education:invalid_characters", "Invalid characters");
  }

  return null;
};

// ✅ UPDATED SPECIALIZATION VALIDATION
export const validateSpecializationTest = (list = []) => {
  const seen = new Set();

  for (let val of list) {
    // ✅ support both string + object
    const value = typeof val === "string" ? val : val?.name;

    const normalized = normalize(value);

    // skip empty values
    if (!normalized) continue;

    if (!validText(value)) {
      return i18n.t("education:invalid_characters", "Invalid characters");
    }

    if (seen.has(normalized)) {
      return i18n.t("education:duplicate_specialization", "Duplicate specialization");
    }

    seen.add(normalized);
  }

  return null;
};

export const validateSpecialization = (list = []) => {
  const seen = new Set();
  for (let val of list) {
    const value = typeof val === "string" ? val : val?.name;

    // ✅ empty validation
    if (!value || !value.trim()) {
      return i18n.t("education:specialization_required", "Specialization is required");
    }

    const normalized = normalize(value);

    // ✅ invalid character validation
    if (!validText(value)) {
      return i18n.t("education:invalid_characters", "Invalid characters");
    }

    // ✅ duplicate validation
    if (seen.has(normalized)) {
      return i18n.t("education:duplicate_specialization", "Duplicate specialization");
    }

    seen.add(normalized);
  }

  return null;
};

export const validateEducationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null, editMode = false } = options;

  console.log("editMode", editMode);

  // ✅ Education Level
  const eduError = validateEducationLevel(formData.educationLevel);
  if (eduError) errors.educationLevel = eduError;

  // ✅ Course (WITH DUPLICATE CHECK)
  const courseError = validateCourse(formData.course);

  if (courseError) {
    errors.course = courseError;
  } else {
    const { existing = [], currentId = null } = options;

    const isDuplicate = existing.some((item) => {
      const sameCourse =
        item.course?.trim().toLowerCase() === formData.course?.trim().toLowerCase();

      const isSameId = item.educationQualificationsId === currentId;

      return sameCourse && !isSameId;
    });

    if (isDuplicate) {
      errors.course = i18n.t("education:duplicate_course", "Course already exists");
    }
  }
  // ✅ Specialization (WITH DUPLICATE CHECK)
  if (editMode) {
    const specError = validateSpecialization(formData.specializationOthers || []);
    if (specError) errors.specialization = specError;

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  } else {
    const specError = validateSpecializationTest(formData.specializationOthers || []);
    if (specError) errors.specialization = specError;

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
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
