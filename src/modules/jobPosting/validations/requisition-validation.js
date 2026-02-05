// requisition-validation.js

// ✔ allowed characters
export const TITLE_ALLOWED_PATTERN = /^[A-Za-z0-9 _\-()/&]*$/;

// date-utils.js or inside requisition-validation.js

export const getTomorrowStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
};


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
      message: "validation:title_invalid_chars"
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
    errors.title = "validation:required";

    valid = false;
  } else if (!TITLE_ALLOWED_PATTERN.test(title)) {
    errors.title = "validation:title_invalid_chars";
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
      errors.startDate = "validation:past_dates_not_allowed";
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
