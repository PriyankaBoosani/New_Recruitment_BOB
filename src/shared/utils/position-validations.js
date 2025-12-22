// src/shared/utils/position-validations.js
 
const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
 
const toStringSafe = (v) => (v === null || v === undefined ? '' : String(v));
 
/**
 * validateTitle
 */
export function validateTitle(title, options = {}) {
  const { existing = [], currentId = null } = options;
  const t = toStringSafe(title).trim();
 
  if (isEmpty(t)) return 'Position title is required';
  if (t.length < 2) return 'Position title must be at least 2 characters';
  if (t.length > 100) return 'Position title must be at most 100 characters';
 
  const lower = t.toLowerCase();
  const duplicate = existing.find(
    it =>
      toStringSafe(it.title).trim().toLowerCase() === lower &&
      (currentId == null || it.id !== currentId)
  );
 
  if (duplicate) return 'Position title must be unique';
  return null;
}
 
/**
 * validateDepartmentId
 */
export function validateDepartmentId(departmentId) {
  if (isEmpty(departmentId)) return 'Department is required';
  return null;
}
 
/**
 * validateJobGradeId
 */
export function validateJobGradeId(jobGradeId) {
  if (isEmpty(jobGradeId)) return 'Job grade is required';
  return null;
}
 
/**
 * validateDescription
 */
export function validateDescription(description) {
  if (isEmpty(description)) return null;
  const d = toStringSafe(description);
  if (d.length > 500) return 'Description must be at most 500 characters';
  return null;
}
 
/**
 * validatePositionForm
 */
export function validatePositionForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;
 
  const titleErr = validateTitle(formData.title, { existing, currentId });
  if (titleErr) errors.title = titleErr;
 
  const deptErr = validateDepartmentId(formData.departmentId);
  if (deptErr) errors.departmentId = deptErr;
 
  const gradeErr = validateJobGradeId(formData.jobGradeId);
  if (gradeErr) errors.jobGradeId = gradeErr;
 
  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;
 
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
 
export default {
  validateTitle,
  validateDepartmentId,
  validateJobGradeId,
  validateDescription,
  validatePositionForm
};
 
 