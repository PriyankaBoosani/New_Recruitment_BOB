// location-validations.js
/**
 * Simple helpers similar to your common-validations
 */
export const requiredField = (val, label = 'Field') => {
  if (val == null || String(val).trim() === '') return `${label} is required`;
  return null;
};

export const minLength = (val, n, label = 'Field') => {
  if (val == null) return null;
  if (String(val).trim().length < n) return `${label} must be at least ${n} characters`;
  return null;
};

export const maxLength = (val, n, label = 'Field') => {
  if (val == null) return null;
  if (String(val).trim().length > n) return `${label} cannot exceed ${n} characters`;
  return null;
};

const normalize = (s = '') => String(s).trim().toLowerCase();

/**
 * Validate location name
 * @param {string} name
 * @returns {string|null}
 */
export const validateLocationName = (name) => {
  let err = requiredField(name, 'Location name');
  if (err) return err;
  err = minLength(name, 2, 'Location name');
  if (err) return err;
  err = maxLength(name, 200, 'Location name');
  if (err) return err;
  return null;
};

/**
 * Validate city (either cityId or cityName must be present)
 * @param {number|null} cityId
 * @param {string} cityName
 * @returns {string|null}
 */
export const validateCity = (cityId, cityName) => {
  if (cityId || (cityName && String(cityName).trim() !== '')) return null;
  return 'City is required';
};

/**
 * Validate location form with uniqueness by (city, name)
 * options:
 *  - existing: array of existing locations [{id, cityId, cityName, name}]
 *  - currentId: id to exclude when editing
 */
export const validateLocationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  const cityId = formData.cityId ?? null;
  const cityName = formData.cityName ?? '';
  const name = formData.name ?? '';

  const cErr = validateCity(cityId, cityName);
  if (cErr) errors.cityId = cErr;

  const nErr = validateLocationName(name);
  if (nErr) errors.name = nErr;

  // uniqueness: same cityName (case-insensitive) and same location name => duplicate
  if (!errors.name && !errors.cityId) {
    const nameNorm = normalize(name);
    const cityNorm = normalize(cityName || ('' + cityId)); // cityName preferable
    const duplicate = existing.find(item => {
      if (!item || !item.name) return false;
      if (currentId != null && item.id === currentId) return false;
      const itemCity = normalize(item.cityName || (item.cityId || ''));
      return itemCity === cityNorm && normalize(item.name) === nameNorm;
    });

    if (duplicate) {
      errors.name = 'A location with this name already exists for the selected city';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export default {
  validateLocationForm,
  validateLocationName,
  validateCity
};