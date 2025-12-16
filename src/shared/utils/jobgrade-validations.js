// src/validators/jobgrade-validations.js
import { requiredField, minLength, maxLength } from './common-validations';

/**
 * Normalize string for uniqueness checks
 */
const normalize = (s = '') => String(s).trim().toLowerCase();

/**
 * Safe number conversion
 */
const toNumberSafe = (v) => {
  if (v === '' || v === null || v === undefined) return NaN;
  const n = Number(String(v).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : NaN;
};

/* =========================
   Field-level validators
========================= */

/**
 * Scale
 */
export const validateScale = (scale) => {
  let error = requiredField(scale, 'Scale');
  if (error) return error;

  error = minLength(scale, 2, 'Scale');
  if (error) return error;

  error = maxLength(scale, 50, 'Scale');
  if (error) return error;

  return null;
};

/**
 * Grade Code
 */
export const validateGradeCode = (gradeCode) => {
  let error = requiredField(gradeCode, 'Grade code');
  if (error) return error;

  error = minLength(gradeCode, 1, 'Grade code');
  if (error) return error;

  error = maxLength(gradeCode, 20, 'Grade code');
  if (error) return error;

  return null;
};

/**
 * Minimum Salary
 */
export const validateMinSalary = (minSalary) => {
  let error = requiredField(minSalary, 'Minimum salary');
  if (error) return error;

  const n = toNumberSafe(minSalary);
  if (Number.isNaN(n)) return 'Minimum salary must be a valid number';
  if (n < 0) return 'Minimum salary cannot be negative';

  return null;
};

/**
 * Maximum Salary
 */
export const validateMaxSalary = (maxSalary) => {
  let error = requiredField(maxSalary, 'Maximum salary');
  if (error) return error;

  const n = toNumberSafe(maxSalary);
  if (Number.isNaN(n)) return 'Maximum salary must be a valid number';
  if (n < 0) return 'Maximum salary cannot be negative';

  return null;
};

/**
 * Description
 */
export const validateDescription = (description) => {
  let error = requiredField(description, 'Description');
  if (error) return error;

  error = minLength(description, 10, 'Description');
  if (error) return error;

  error = maxLength(description, 500, 'Description');
  if (error) return error;

  return null;
};

/* =========================
   Form-level validator
========================= */

export const validateJobGradeForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // ----- basic field validations -----
  const scaleErr = validateScale(formData.scale);
  if (scaleErr) errors.scale = scaleErr;

  const codeErr = validateGradeCode(formData.gradeCode);
  if (codeErr) errors.gradeCode = codeErr;

  const minErr = validateMinSalary(formData.minSalary);
  if (minErr) errors.minSalary = minErr;

  const maxErr = validateMaxSalary(formData.maxSalary);
  if (maxErr) errors.maxSalary = maxErr;

  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  // ----- salary cross-field check -----
  const minNum = toNumberSafe(formData.minSalary);
  const maxNum = toNumberSafe(formData.maxSalary);
  if (!Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum > maxNum) {
    errors.minSalary = errors.minSalary || 'Minimum salary must be ≤ maximum salary';
    errors.maxSalary = errors.maxSalary || 'Maximum salary must be ≥ minimum salary';
  }

  // ----- uniqueness checks (only if base validation passed) -----
  if (!errors.scale) {
    const scaleNorm = normalize(formData.scale);
    const duplicate = existing.find(e =>
      normalize(e.scale) === scaleNorm &&
      (currentId == null || e.id !== currentId)
    );
    if (duplicate) errors.scale = 'Scale already exists';
  }

  if (!errors.gradeCode) {
    const codeNorm = normalize(formData.gradeCode);
    const duplicate = existing.find(e =>
      normalize(e.gradeCode) === codeNorm &&
      (currentId == null || e.id !== currentId)
    );
    if (duplicate) errors.gradeCode = 'Grade code already exists';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateScale,
  validateGradeCode,
  validateMinSalary,
  validateMaxSalary,
  validateDescription,
  validateJobGradeForm
};
