// src/validators/position-validations.js

const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

const toStringSafe = (v) => (v === null || v === undefined ? '' : String(v));

/**
 * validateTitle
 * - required
 * - length limits
 * - uniqueness (against existing positions, case-insensitive), skip currentId when editing
 */
export function validateTitle(title, options = {}) {
  const { existing = [], currentId = null } = options;
  const t = toStringSafe(title).trim();

  if (isEmpty(t)) return 'Position title is required';
  if (t.length < 2) return 'Position title must be at least 2 characters';
  if (t.length > 100) return 'Position title must be at most 100 characters';

  const lower = t.toLowerCase();
  const duplicate = existing.find(it => toStringSafe(it.title).trim().toLowerCase() === lower && (currentId == null || it.id !== currentId));
  if (duplicate) return 'Position title must be unique';

  return null;
}

/**
 * validateDepartmentName
 * - required
 * - must be non-empty string (optionally could check existence in allowed list)
 */
export function validateDepartmentName(department) {
  if (isEmpty(department)) return 'Department is required';
  const d = toStringSafe(department).trim();
  if (d.length > 100) return 'Department must be at most 100 characters';
  return null;
}

/**
 * validateJobGrade
 * - required
 */
export function validateJobGrade(jobGrade) {
  if (isEmpty(jobGrade)) return 'Job grade is required';
  const g = toStringSafe(jobGrade).trim();
  if (g.length > 20) return 'Job grade must be at most 20 characters';
  return null;
}

/**
 * validateDescription
 * - optional, max length
 */
export function validateDescription(description) {
  if (isEmpty(description)) return null;
  const d = toStringSafe(description);
  if (d.length > 500) return 'Description must be at most 500 characters';
  return null;
}

/**
 * validatePositionForm
 * - returns { valid, errors }
 * options: { existing: [], currentId: null }
 */
export function validatePositionForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;

  const titleErr = validateTitle(formData.title, { existing, currentId });
  if (titleErr) errors.title = titleErr;

  const deptErr = validateDepartmentName(formData.department);
  if (deptErr) errors.department = deptErr;

  const gradeErr = validateJobGrade(formData.jobGrade);
  if (gradeErr) errors.jobGrade = gradeErr;

  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  return { valid: Object.keys(errors).length === 0, errors };
}

export default {
  validateTitle,
  validateDepartmentName,
  validateJobGrade,
  validateDescription,
  validatePositionForm
};
