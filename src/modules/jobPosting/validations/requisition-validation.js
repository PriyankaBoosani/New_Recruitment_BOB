// requisition-validation.js

// Validation helper functions
const requiredField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};


const validateFile = (file) => {
  if (!file) {
    return 'Please upload an indent file';
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload a PDF, DOC, DOCX, PNG, or JPG file';
  }

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return 'File size must be less than 5MB';
  }

  return null;
};

/**
 * Validate Requisition form
 */
export const validateRequisitionForm = (formData, file) => {
  const errors = {};

  // Validate title
  let error = requiredField(formData.title, 'This feild');
  
  if (error) errors.title = error;

  // Validate description
  error = requiredField(formData.description, 'This feild');
 
  if (error) errors.description = error;

  // Validate dates
  if (!formData.startDate) {
    errors.startDate = 'This feild is required';
  }

  if (!formData.endDate) {
    errors.endDate = 'This feild is required';
  }

  // Validate file
  const fileError = validateFile(file);
  if (fileError) {
    errors.indentFile = fileError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};