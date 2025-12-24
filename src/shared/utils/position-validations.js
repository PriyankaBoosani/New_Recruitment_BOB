// src/shared/utils/position-validations.js
 
import { requiredField, minLength, maxLength } from './common-validations';
import i18n from 'i18next';
 
const normalizeTitle = (s = '') => String(s).trim().toLowerCase();
const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
 
export const validatePositionTitle = (title, options = {}) => {
  const { existing = [], currentId = null } = options;
  
  let error = requiredField(title);
  if (error) return error;

  error = minLength(title, 2);
  if (error) return error;

  error = maxLength(title, 100);
  if (error) return error;

  // Check for duplicate titles
  if (existing.length > 0) {
    const titleNorm = normalizeTitle(title);
    const duplicate = existing.find(p => {
      if (!p?.title) return false;
      if (currentId != null && p.id === currentId) return false;
      return normalizeTitle(p.title) === titleNorm;
    });

    if (duplicate) {
      return i18n.t('validation:duplicate');
    }
  }

  return null;
};
 
export const validateDepartmentId = (departmentId) => {
  if (isEmpty(departmentId)) return i18n.t('validation:required', { field: 'Department' });
  return null;
};
 
export const validateJobGradeId = (jobGradeId) => {
  if (isEmpty(jobGradeId)) return i18n.t('validation:required', { field: 'Job grade' });
  return null;
};
 
export const validatePositionDescription = (description) => {
  // Make description required
  let error = requiredField(description);
  if (error) return error;

  // Then check length
  error = minLength(description, 10);
  if (error) return error;

  error = maxLength(description, 500);
  if (error) return error;

  return null;
};
 
export const validatePositionForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // Validate title with uniqueness check
  const titleError = validatePositionTitle(formData.title, { existing, currentId });
  if (titleError) errors.title = titleError;

  // Validate required fields
  const deptError = validateDepartmentId(formData.departmentId);
  if (deptError) errors.departmentId = deptError;

  const gradeError = validateJobGradeId(formData.jobGradeId);
  if (gradeError) errors.jobGradeId = gradeError;

  // Validate description (optional)
  const descError = validatePositionDescription(formData.description);
  if (descError) errors.description = descError;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
 
export default {
  validatePositionTitle,
  validateDepartmentId,
  validateJobGradeId,
  validatePositionDescription,
  validatePositionForm
};