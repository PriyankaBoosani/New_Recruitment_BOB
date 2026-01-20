const TITLE_PATTERN = /^[A-Za-z0-9\s\-_/&]+$/;

export const validateRequisitionForm = (formData = {}) => {
  const errors = {};
  let valid = true;

  // TITLE
  if (!formData.title?.trim()) {
    errors.title = "This field is required";
    valid = false;
  } else if (!TITLE_PATTERN.test(formData.title.trim())) {
    errors.title =
      "Only letters, numbers, spaces, -, _, / and & are allowed";
    valid = false;
  }

  // DESCRIPTION
  if (!formData.description?.trim()) {
    errors.description = "This field is required";
    valid = false;
  }

  // START DATE
  if (!formData.startDate) {
    errors.startDate = "This field is required";
    valid = false;
  }

  // END DATE
  if (!formData.endDate) {
    errors.endDate = "This field is required";
    valid = false;
  }

  // DATE LOGIC
  if (formData.startDate && formData.endDate) {
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "End date cannot be before start date";
      valid = false;
    }
  }

  return { valid, errors };
};
