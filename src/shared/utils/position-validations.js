// src/shared/utils/position-validations.js

import { requiredField, minLength, maxLength } from './common-validations';
import i18n from 'i18next';

const normalizeTitle = (s = '') => String(s).trim().toLowerCase();
const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

/* ---------------- TITLE ---------------- */
export const validatePositionTitle = (title, options = {}) => {
  const { existing = [], currentId = null } = options;

  let error = requiredField(title);
  if (error) return error;

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

/* ---------------- DEPARTMENT ---------------- */
export const validateDepartmentId = (departmentId) => {
  if (isEmpty(departmentId)) {
    return i18n.t('validation:required', { field: 'Department' });
  }
  return null;
};

/* ---------------- JOB GRADE ---------------- */
export const validateJobGradeId = (jobGradeId) => {
  if (isEmpty(jobGradeId)) {
    return i18n.t('validation:required', { field: 'Job grade' });
  }
  return null;
};



/* ---------------- MANDATORY EXPERIENCE ---------------- */
export const validateMandatoryExperience = (value) => {
  let error = requiredField(value);
  if (error) return error;
  return null;
};

/* ---------------- PREFERRED EXPERIENCE ---------------- */
export const validatePreferredExperience = (value) => {
  let error = requiredField(value);
  if (error) return error;
  return null;
};

/* ---------------- MANDATORY EDUCATION ---------------- */
export const validateMandatoryEducation = (value) => {
  let error = requiredField(value);
  if (error) return error;
  return null;
};

/* ---------------- PREFERRED EDUCATION ---------------- */
export const validatePreferredEducation = (value) => {
 let error = requiredField(value);
  if (error) return error;
  return null;
};

/* ---------------- ROLES & RESPONSIBILITIES ---------------- */
export const validateRolesResponsibilities = (value) => {
  let error = requiredField(value);
  if (error) return error;
  return null;
};

/* ---------------- FORM ---------------- */
export const validatePositionForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  const titleError = validatePositionTitle(formData.title, { existing, currentId });
  if (titleError) errors.title = titleError;

  const deptError = validateDepartmentId(formData.departmentId);
  if (deptError) errors.departmentId = deptError;

  const gradeError = validateJobGradeId(formData.jobGradeId);
  if (gradeError) errors.jobGradeId = gradeError;


  const mandExpError = validateMandatoryExperience(formData.mandatoryExperience);
  if (mandExpError) errors.mandatoryExperience = mandExpError;

  const prefExpError = validatePreferredExperience(formData.preferredExperience);
  if (prefExpError) errors.preferredExperience = prefExpError;

  const mandEduError = validateMandatoryEducation(formData.mandatoryEducation);
  if (mandEduError) errors.mandatoryEducation = mandEduError;

  const prefEduError = validatePreferredEducation(formData.preferredEducation);
  if (prefEduError) errors.preferredEducation = prefEduError;

  const rolesError = validateRolesResponsibilities(formData.rolesResponsibilities);
  if (rolesError) errors.rolesResponsibilities = rolesError;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validatePositionTitle,
  validateDepartmentId,
  validateJobGradeId,
  
  validateMandatoryExperience,
  validatePreferredExperience,
  validateMandatoryEducation,
  validatePreferredEducation,
  validateRolesResponsibilities,
  validatePositionForm
};
