import { requiredField, minLength, maxLength } from './common-validations';

/**
 * Normalize a name for comparison (trim + lower)
 * @param {string} s
 */
const normalizeName = (s = '') => String(s).trim().toLowerCase();

/**
 * Validate department name
 * @param {string} name
 * @returns {string|null}
 */
export const validateDepartmentName = (name) => {
  let error = requiredField(name, 'Department name');
  if (error) return error;

  error = minLength(name, 2, 'Department name');
  if (error) return error;

  error = maxLength(name, 100, 'Department name');
  if (error) return error;

  return null;
};

/**
 * Validate department description
 * @param {string} description
 * @returns {string|null}
 */
export const validateDepartmentDescription = (description) => {
  let error = requiredField(description, 'Description');
  if (error) return error;

  error = minLength(description, 10, 'Description');
  if (error) return error;

  error = maxLength(description, 500, 'Description');
  if (error) return error;

  return null;
};

/**
 * Validate department form data with optional uniqueness check
 * @param {Object} formData - { name, description }
 * @param {Object} options - { existing: Array<{id,name}>, currentId: number|null }
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateDepartmentForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // basic field checks
  const nameError = validateDepartmentName(formData.name);
  if (nameError) errors.name = nameError;

  const descError = validateDepartmentDescription(formData.description);
  if (descError) errors.description = descError;

  // uniqueness check (only if name passed basic checks)
  if (!errors.name) {
    const nameNorm = normalizeName(formData.name);
    const duplicate = existing.find(d => {
      if (!d || !d.name) return false;
      if (currentId != null && d.id === currentId) return false; // ignore self when editing
      return normalizeName(d.name) === nameNorm;
    });

    if (duplicate) {
      errors.name = 'A department with this name already exists';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateDepartmentName,
  validateDepartmentDescription,
  validateDepartmentForm,
};
