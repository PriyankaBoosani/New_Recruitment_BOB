// requisition-validation.js

// ✔ allowed characters
export const TITLE_ALLOWED_PATTERN = /^[A-Za-z0-9 _\-()/&]*$/;

// ✔ normalize spaces (no leading, no multiple)
export const normalizeTitle = (value = "") =>
  value
    .replace(/\s+/g, " ")   // collapse multiple spaces
    .replace(/^\s+/, "");  // remove leading spaces

// ✔ typing-time validator (USED IN onChange)
export const validateTitleOnType = (value) => {
  if (!TITLE_ALLOWED_PATTERN.test(value)) {
    return {
      valid: false,
      message:
        "Only letters, numbers, spaces, -, _, /, (), and & are allowed"
    };
  }

  return {
    valid: true,
    value: normalizeTitle(value)
  };
};

// ✔ submit-time validator (USED ON SAVE)
export const validateRequisitionForm = (formData = {}) => {
  const errors = {};
  let valid = true;

  const title = normalizeTitle(formData.title || "");

  if (!title) {
    errors.title = "This field is required";
    valid = false;
  } else if (!TITLE_ALLOWED_PATTERN.test(title)) {
    errors.title =
      "Only letters, numbers, spaces, -, _, /, (), and & are allowed";
    valid = false;
  }

  if (!formData.description?.trim()) {
    errors.description = "This field is required";
    valid = false;
  }

  if (!formData.startDate) {
    errors.startDate = "This field is required";
    valid = false;
  }

  if (!formData.endDate) {
    errors.endDate = "This field is required";
    valid = false;
  }

  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.endDate) < new Date(formData.startDate)
  ) {
    errors.endDate = "End date cannot be before start date";
    valid = false;
  }

  return { valid, errors };
};
