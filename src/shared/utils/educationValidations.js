import { requiredField } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */

const normalize = (v = "") => String(v).trim().toLowerCase();

const validText = (value) => /^[A-Za-z0-9\s.&,()+\-_/]+$/.test(value);
const validTextForm = (value) => /^[A-Za-z0-9\s.,&()+/_\-–—]+$/.test(value);

/* =========================
   FIELD VALIDATIONS
========================= */

export const validateEducationLevel = (value) => {
  return requiredField(value) || null;
};

export const validateCourse = (value) => {
  let error = requiredField(value);
  if (error) return error;

  const course = value.trim();

  if (course.length < 3) {
    return i18n.t(
      "education:course_min_length",
      "Course must be at least 3 characters"
    );
  }

  if (!validTextForm(course)) {
    return i18n.t("education:invalid_characters", "Invalid characters");
  }

  // '+' cannot be at the beginning
  if (/^\+/.test(course)) {
    return i18n.t("education:invalid_course", "Course cannot start with +");
  }

  // '+' cannot be at the end
  if (/\+$/.test(course)) {
    return i18n.t("education:invalid_course", "Course cannot end with +");
  }

  // Multiple consecutive '+' not allowed
  if (/\+{2,}/.test(course)) {
    return i18n.t("education:invalid_course", "Invalid course format");
  }

  return null;
};

export const validateCourseCode = (
  value,
  existing = [],
  currentId = null,
  educationLevel = ""
) => {
  // REQUIRED
  let error = requiredField(value);

  if (error) {
    return i18n.t("education:course_code_required", "Course code is required");
  }

  const normalized = normalize(value);
  const normalizedEducationLevel = normalize(educationLevel);

  const isDuplicate = existing.some((item) => {
    const sameCode = normalize(item.qualificationCode) === normalized;

    const sameEducationLevel =
      normalize(item.educationLevel) === normalizedEducationLevel;

    const isSameId = item.educationQualificationsId === currentId;

    return sameCode && sameEducationLevel && !isSameId;
  });

  if (isDuplicate) {
    return i18n.t(
      "education:duplicate_course_code",
      "Course code already exists for this education level"
    );
  }

  return null;
};
export const validateSpecializationTest = (list = []) => {
  const seen = new Set();
  const seenCodes = new Set();

  for (let val of list) {
    const value = typeof val === "string" ? val : val?.name;

    const code = typeof val === "object" ? val?.code : "";

    // Empty row is allowed here.
    // Save validation will decide whether it's required.
    if (!value?.trim()) {
      continue;
    }

    // Once Name is entered, Code becomes mandatory.
    if (!code?.trim()) {
      return i18n.t(
        "education:specialization_code_required",
        "Specialization code is required"
      );
    }

    const normalized = normalize(value);
    const normalizedCode = normalize(code);

    // skip empty values
    if (!normalized) continue;

    if (!validText(value)) {
      return i18n.t("education:invalid_characters", "Invalid characters");
    }
    if (seenCodes.has(normalizedCode)) {
      return i18n.t(
        "education:duplicate_specialization_code",
        "Duplicate specialization code"
      );
    }

    if (seen.has(normalized)) {
      return i18n.t(
        "education:duplicate_specialization",
        "Duplicate specialization"
      );
    }

    seen.add(normalized);
    seenCodes.add(normalizedCode);
  }

  return null;
};

export const validateSpecialization = (list = []) => {
  const seen = new Set();
  const seenCodes = new Set();
  for (let val of list) {
    const value = typeof val === "string" ? val : val?.name;

    const code = typeof val === "object" ? val?.code : "";

    // ✅ specialization required
    // Empty row is allowed here.
    // Save validation will decide whether it's required.
    if (!value?.trim()) {
      continue;
    }

    // Once Name is entered, Code becomes mandatory.
    if (!code?.trim()) {
      return i18n.t(
        "education:specialization_code_required",
        "Specialization code is required"
      );
    }

    const normalized = normalize(value);
    const normalizedCode = normalize(code);

    // ✅ invalid character validation
    if (!validText(value)) {
      return i18n.t("education:invalid_characters", "Invalid characters");
    }

    // ✅ duplicate validation
    if (seen.has(normalized)) {
      return i18n.t(
        "education:duplicate_specialization",
        "Duplicate specialization"
      );
    }
    if (seenCodes.has(normalizedCode)) {
      return i18n.t(
        "education:duplicate_specialization_code",
        "Duplicate specialization code"
      );
    }

    seen.add(normalized);
    seenCodes.add(normalizedCode);
  }

  return null;
};

export const validateEducationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null, editMode = false } = options;

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
      const sameCourse = normalize(item.course) === normalize(formData.course);

      const sameEducationLevel =
        normalize(item.educationLevel) ===
        normalize(options.educationLevelName);

      const isSameId = item.educationQualificationsId === currentId;

      return sameCourse && sameEducationLevel && !isSameId;
    });

    if (isDuplicate) {
      errors.course = i18n.t(
        "education:duplicate_course",
        "Course already exists"
      );
    }
  }

  /* =========================
   COURSE CODE VALIDATION
========================= */

 const courseCodeError = validateCourseCode(
  formData.courseCode,
  existing,
  currentId,
  options.educationLevelName
);

  if (courseCodeError) {
    errors.courseCode = courseCodeError;
  }
  // ✅ Specialization (WITH DUPLICATE CHECK)
  if (editMode) {
    const specError = validateSpecialization(
      formData.specializationOthers || []
    );
    if (specError) {
      if (
        specError ===
        i18n.t(
          "education:specialization_code_required",
          "Specialization code is required"
        )
      ) {
        errors.specializationCode = specError;
      } else {
        errors.specialization = specError;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  } else {
    const specError = validateSpecializationTest(
      formData.specializationOthers || []
    );
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
  validateCourseCode,
  validateSpecialization,
};
export default educationValidations;
