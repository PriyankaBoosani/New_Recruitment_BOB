import { requiredField } from "./common-validations";
import i18n from "i18next";

/* =========================
   HELPERS
========================= */

const normalize = (v = "") => String(v).trim().toLowerCase();

/* =========================
   FIELD VALIDATIONS
========================= */

// ✅ State
export const validateState = (value) => {
  return requiredField(value) || null;
};

// ✅ Languages (FIXED FOR IDS)
export const validateLanguages = (list = []) => {
  console.log("test---", list);

  // ✅ REQUIRED CHECK
  if (!list || list.length === 0) {
    return i18n.t(
      "statelang:languages_required",
      "Please select at least one language"
    );
  }

  // ✅ DUPLICATE CHECK ONLY
  const seen = new Set();

  for (let val of list) {
    if (seen.has(val)) {
      return i18n.t(
        "statelang:duplicate_language",
        "Duplicate language"
      );
    }
    seen.add(val);
  }

  return null;
};

/* =========================
   FORM VALIDATION
========================= */

export const validateStateLanguageForm = (
  formData = {},
  options = {}
) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // ✅ State
  const stateError = validateState(formData.state);
  if (stateError) errors.state = stateError;

  // ✅ Languages
  const langError = validateLanguages(formData.languages);
  if (langError) errors.languages = langError;

  // ✅ Duplicate State (FIXED)
  if (!stateError) {
   const isDuplicate = existing.some((item) => {

  const sameState =
    String(item.stateId) === String(formData.state);

  // Ignore current editing record
  const isCurrentRecord =
    String(item.stateId) === String(currentId);

  return sameState && !isCurrentRecord;
});
    if (isDuplicate) {
      errors.state = i18n.t(
        "statelang:duplicate_state",
        "State already exists"
      );
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};