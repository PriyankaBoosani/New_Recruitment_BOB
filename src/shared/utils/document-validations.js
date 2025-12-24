import { requiredField, minLength, maxLength } from './common-validations';
import i18n from 'i18next';

/**
 * Normalize string for uniqueness comparison
 */
const normalizeName = (s = '') => String(s).trim().toLowerCase();

/**
 * Validate document name
 */
export const validateDocumentName = (name) => {
  let error = requiredField(name, i18n.t('validation:document_name_required'));
  if (error) return error;

  error = minLength(name, 2, i18n.t('validation:document_name_min'));
  if (error) return error;

  error = maxLength(name, 150, i18n.t('validation:document_name_max'));
  if (error) return error;

  return null;
};

/**
 * Validate document description (optional)
 */
export const validateDocumentDescription = (description) => {
  let error = requiredField(
    description,
    i18n.t('validation:document_description_required')
  );
  if (error) return error;

  error = minLength(
    description,
    5,
    i18n.t('validation:document_description_min')
  );
  if (error) return error;

  error = maxLength(
    description,
    500,
    i18n.t('validation:document_description_max')
  );
  if (error) return error;

  return null;
};


/**
 * Validate complete document form
 */
export const validateDocumentForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  // Name validation
  const nameError = validateDocumentName(formData.name);
  if (nameError) errors.name = nameError;

  // Description validation
  const descError = validateDocumentDescription(formData.description);
  if (descError) errors.description = descError;

  // Uniqueness check
  if (!errors.name && formData.name) {
    const nameNorm = normalizeName(formData.name);

    const duplicate = existing.find(doc => {
      if (!doc?.name) return false;
      if (currentId != null && doc.id === currentId) return false;
      return normalizeName(doc.name) === nameNorm;
    });

    if (duplicate) {
      errors.name = i18n.t('validation:duplicate');
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateDocumentForm,
  validateDocumentName,
  validateDocumentDescription
};
