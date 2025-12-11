// src/validators/interviewpanel-validations.js

const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

export function validatePanelName(name, { existing = [], currentId = null } = {}) {
  const n = String(name || '').trim();
  if (isEmpty(n)) return 'Panel name is required';
  if (n.length < 3) return 'Panel name must be at least 3 characters';
  if (n.length > 200) return 'Panel name must be at most 200 characters';

  const dup = existing.find(
    it =>
      String(it.name || '').trim().toLowerCase() === n.toLowerCase() &&
      (currentId == null || it.id !== currentId)
  );

  if (dup) return 'Panel name must be unique';
  return null;
}

export function validatePanelMembers(members) {
  const m = String(members || '').trim();
  if (isEmpty(m)) return 'Panel members are required';
  if (m.length > 500) return 'Panel members must be at most 500 characters';
  return null;
}

export function validateInterviewPanelForm(formData = {}, options = {}) {
  const errors = {};
  const existing = options.existing || [];
  const currentId = options.currentId ?? null;

  const nameErr = validatePanelName(formData.name, { existing, currentId });
  if (nameErr) errors.name = nameErr;

  const memErr = validatePanelMembers(formData.members);
  if (memErr) errors.members = memErr;

  return { valid: Object.keys(errors).length === 0, errors };
}

export default {
  validatePanelName,
  validatePanelMembers,
  validateInterviewPanelForm
};
