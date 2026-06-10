// requisition-validation.js

// ✔ allowed characters
export const TITLE_ALLOWED_PATTERN =
  /^[A-Za-z0-9\s.,\-_/()&:;'"@#]*$/;

export const DESCRIPTION_ALLOWED_PATTERN =
  /^[A-Za-z0-9\s.,\-_/()&:;'"@#%+]*$/;
export const getTomorrowStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
};

// ✔ normalize spaces (no leading, no multiple)
export const normalizeTitle = (value = "") =>
  value
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/^\s+/, ""); // remove leading spaces

// ✔ typing-time validator (USED IN onChange)
export const validateTitleOnType = (value) => {
  const normalized = normalizeTitle(value);

  if (!TITLE_ALLOWED_PATTERN.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      message: "validation:invalid_requisition_title",
    };
  }

  return {
    valid: true,
    value: normalized,
  };
};

// ✔ submit-time validator (USED ON SAVE)
export const validateRequisitionForm = (formData = {}) => {
  const errors = {};
  let valid = true;
 
  const title = normalizeTitle(formData.title || "");
 
  if (!title) {
    errors.title = "validation:required";
 
    valid = false;
  }
 
  if (!formData.description?.trim()) {
    errors.description = "validation:required";
 
    valid = false;
  }
 
  const tomorrow = getTomorrowStart();
  if (!formData.startDate) {
    errors.startDate = "validation:required";
    valid = false;
  } else {
    const startDate = new Date(formData.startDate);
    startDate.setHours(0, 0, 0, 0);
 
    if (startDate < tomorrow) {
      errors.startDate = "validation:requisition_date_future";
      valid = false;
    }
  }
 
 
  if (!formData.endDate) {
    errors.endDate = "validation:required";
    valid = false;
  }
 
  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.endDate) < new Date(formData.startDate)
  ) {
    errors.endDate = "validation:end_before_start";
    valid = false;
  }
 
  return { valid, errors };
};
export const validateDescriptionOnType = (value) => {
  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/^\s+/, "");

  if (!DESCRIPTION_ALLOWED_PATTERN.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      message: "validation:invalid_requisition_description",
    };
  }

  return {
    valid: true,
    value: normalized,
  };
};