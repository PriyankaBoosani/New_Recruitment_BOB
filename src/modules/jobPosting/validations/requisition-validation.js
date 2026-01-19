export const validateRequisitionForm = (formData = {}) => {
  const errors = {};
  let valid = true;

  if (!formData.title?.trim()) {
    errors.title = "This field is required";
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

  if (formData.startDate && formData.endDate) {
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "End date cannot be before start date";
      valid = false;
    }
  }

  return { valid, errors };
};
