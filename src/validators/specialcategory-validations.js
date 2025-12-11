// src/validators/specialcategory-validations.js

const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

export function validateCode(code, { existing = [], currentId = null } = {}) {
  const c = String(code || '').trim();
  if (isEmpty(c)) return 'Code is required';
  if (c.length < 1) return 'Code must be at least 1 character';
  if (c.length > 20) return 'Code must be at most 20 characters';

  const dup = existing.find(it => String(it.code || '').trim().toLowerCase() === c.toLowerCase() && (currentId == null || it.id !== currentId));
  if (dup) return 'Code must be unique';
  return null;
}

export function validateName(name) {
  const n = String(name || '').trim();
  if (isEmpty(n)) return 'Name is required';
  if (n.length < 2) return 'Name must be at least 2 characters';
  if (n.length > 150) return 'Name must be at most 150 characters';
  return null;
}

export function validateDescription(description) {
  if (isEmpty(description)) return null;
  const d = String(description);
  if (d.length > 500) return 'Description must be at most 500 characters';
  return null;
}

export function validateSpecialCategoryForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;

  const codeErr = validateCode(formData.code, { existing, currentId });
  if (codeErr) errors.code = codeErr;

  const nameErr = validateName(formData.name);
  if (nameErr) errors.name = nameErr;

  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  return { valid: Object.keys(errors).length === 0, errors };
}

export default {
  validateCode,
  validateName,
  validateDescription,
  validateSpecialCategoryForm
};
