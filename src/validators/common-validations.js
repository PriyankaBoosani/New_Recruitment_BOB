/**
 * Common validation functions that can be reused across the application
 */

export const requiredField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const minLength = (value, min, fieldName) => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

export const maxLength = (value, max, fieldName) => {
  if (value && value.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }
  return null;
};

export const emailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const phoneFormat = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    return 'Please enter a valid 10-digit phone number';
  }
  return null;
};
