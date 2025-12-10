// src/validators/jobgrade-validations.js

/**
 * Basic small helpers used by multiple validators.
 */
const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

const toNumberSafe = (v) => {
  if (v === '' || v === null || v === undefined) return NaN;
  // allow numeric strings and numbers
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : NaN;
};

/**
 * validateScale
 * - required
 * - length limits
 * - uniqueness against existing items (case-insensitive), skip currentId when editing
 */
export function validateScale(scale, options = {}) {
  const { existing = [], currentId = null } = options;
  const s = String(scale ?? '').trim();

  if (isEmpty(s)) return 'Scale is required';
  if (s.length < 2) return 'Scale must be at least 2 characters';
  if (s.length > 50) return 'Scale must be at most 50 characters';

  const lower = s.toLowerCase();
  const duplicate = existing.find(it => String(it.scale ?? '').trim().toLowerCase() === lower && (currentId == null || it.id !== currentId));
  if (duplicate) return 'Scale must be unique';

  return null;
}

/**
 * validateMinSalary / validateMaxSalary
 * - required
 * - numeric
 * - non-negative (min >= 0)
 * - optionally integer only (currently allow decimals)
 */
export function validateMinSalary(minSalary) {
  if (isEmpty(minSalary) && minSalary !== 0) return 'Minimum salary is required';
  const n = toNumberSafe(minSalary);
  if (Number.isNaN(n)) return 'Minimum salary must be a valid number';
  if (n < 0) return 'Minimum salary cannot be negative';
  return null;
}

export function validateMaxSalary(maxSalary) {
  if (isEmpty(maxSalary) && maxSalary !== 0) return 'Maximum salary is required';
  const n = toNumberSafe(maxSalary);
  if (Number.isNaN(n)) return 'Maximum salary must be a valid number';
  if (n < 0) return 'Maximum salary cannot be negative';
  return null;
}

/**
 * validateDescription
 * - optional, but length limit
 */
export function validateDescription(description) {
  if (isEmpty(description)) return null;
  const d = String(description);
  if (d.length > 500) return 'Description must be at most 500 characters';
  return null;
}

/**
 * validateJobGradeForm
 * - formData: { scale, minSalary, maxSalary, description }
 * - options: { existing: [], currentId: null }
 *
 * Returns: { valid: boolean, errors: { field: message } }
 */
export function validateJobGradeForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;

  // scale
  const scaleErr = validateScale(formData.scale, { existing, currentId });
  if (scaleErr) errors.scale = scaleErr;

  // minSalary
  const minErr = validateMinSalary(formData.minSalary);
  if (minErr) errors.minSalary = minErr;

  // maxSalary
  const maxErr = validateMaxSalary(formData.maxSalary);
  if (maxErr) errors.maxSalary = maxErr;

  // if both min & max numeric, check min <= max
  const minNum = toNumberSafe(formData.minSalary);
  const maxNum = toNumberSafe(formData.maxSalary);
  if (!Number.isNaN(minNum) && !Number.isNaN(maxNum)) {
    if (minNum > maxNum) {
      errors.minSalary = errors.minSalary || 'Minimum salary must be less than or equal to maximum salary';
      errors.maxSalary = errors.maxSalary || 'Maximum salary must be greater than or equal to minimum salary';
    }
  }

  // description
  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export default {
  validateScale,
  validateMinSalary,
  validateMaxSalary,
  validateDescription,
  validateJobGradeForm
};
