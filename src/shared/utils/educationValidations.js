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
    // ✅ support both string + object
    const value =
      typeof val === "string" ? val : val?.name;

    const normalized = normalize(value);

    // skip empty values
    if (!normalized) continue;

    // ❌ invalid characters
    if (!validText(value)) {
      return i18n.t(
        "education:invalid_characters",
        "Invalid characters"
      );
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
// export const validateSpecialization = (list = []) => {
//   const seen = new Set();

//   for (let val of list) {
//     const normalized = normalize(val);

//     // skip empty values
//     if (!normalized) continue;

//     // ❌ invalid characters
//     if (!validText(val)) {
//       return i18n.t("education:invalid_characters", "Invalid characters");
//     }

//     // ❌ duplicate specialization
//     if (seen.has(normalized)) {
//       return i18n.t(
//         "education:duplicate_specialization",
//         "Duplicate specialization"
//       );
//     }

//     seen.add(normalized);
//   }

//   return null;
// };

/* =========================
   FORM VALIDATION
========================= */

export const validateEducationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // ✅ Education Level
  const eduError = validateEducationLevel(formData.educationLevel);
  if (eduError) errors.educationLevel = eduError;

  // ✅ Course (WITH DUPLICATE CHECK)
  const courseError = validateCourse(formData.course);
  console.log("Course validation error:", courseError); // ✅ check course error

  if (courseError) {
    console.log("Course validation failed, skipping duplicate check."); // ✅ debug log
    errors.course = courseError;
  } else {
    console.log("Checking for duplicate course among existing entries..."); // ✅ debug log
    const { existing = [], currentId = null } = options;

    const isDuplicate = existing.some((item) => {
      const sameCourse =
        item.course?.trim().toLowerCase() ===
        formData.course?.trim().toLowerCase();

      const isSameId =
        item.educationQualificationsId === currentId;

      return sameCourse && !isSameId;
    });

    if (isDuplicate) {
     errors.course = i18n.t(
  "education:duplicate_course",
  "Course already exists"
);
    }
  }
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