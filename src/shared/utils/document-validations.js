// src/validators/document-validations.js

const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

export function validateName(name, { existing = [], currentId = null } = {}) {
  const n = String(name || '').trim();
  if (isEmpty(n)) return 'Document name is required';
  if (n.length < 2) return 'Document name must be at least 2 characters';
  if (n.length > 150) return 'Document name must be at most 150 characters';

  const dup = existing.find(it => String(it.name || '').trim().toLowerCase() === n.toLowerCase() && (currentId == null || it.id !== currentId));
  if (dup) return 'Document name must be unique';
  return null;
}

export function validateDescription(desc) {
  if (isEmpty(desc)) return null;
  const d = String(desc);
  if (d.length > 500) return 'Description must be at most 500 characters';
  return null;
}

export function validateDocumentForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;

  const nameErr = validateName(formData.name, { existing, currentId });
  if (nameErr) errors.name = nameErr;

  const descErr = validateDescription(formData.description);
  if (descErr) errors.description = descErr;

  return { valid: Object.keys(errors).length === 0, errors };
}

export default {
  validateDocumentForm,
  validateName,
  validateDescription
};