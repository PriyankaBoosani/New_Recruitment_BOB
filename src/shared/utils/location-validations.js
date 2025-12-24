import i18n from "i18next";

/**
 * Required field
 */
export const requiredField = (val) => {
  if (val == null || String(val).trim() === "") {
    return i18n.t("validation:required");
  }
  return null;
};

/**
 * Minimum length
 */
export const minLength = (val, n) => {
  if (val == null) return null;
  if (String(val).trim().length < n) {
    return i18n.t("validation:minLength", { min: n });
  }
  return null;
};

/**
 * Maximum length
 */
export const maxLength = (val, n) => {
  if (val == null) return null;
  if (String(val).trim().length > n) {
    return i18n.t("validation:maxLength", { max: n });
  }
  return null;
};

const normalize = (s = "") => String(s).trim().toLowerCase();

/**
 * Validate location name
 */
export const validateLocationName = (name) => {
  let err = requiredField(name);
  if (err) return err;

  err = minLength(name, 2);
  if (err) return err;

  err = maxLength(name, 200);
  if (err) return err;

  return null;
};

/**
 * Validate city
 */
export const validateCity = (cityId, cityName) => {
  if (cityId || (cityName && String(cityName).trim() !== "")) return null;
  return i18n.t("validation:required");
};

/**
 * Validate location form
 */
export const validateLocationForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;

  const cityId = formData.cityId ?? null;
  const cityName = formData.cityName ?? "";
  const name = formData.name ?? "";

  const cErr = validateCity(cityId, cityName);
  if (cErr) errors.cityId = cErr;

  const nErr = validateLocationName(name);
  if (nErr) errors.name = nErr;

  if (!errors.name && !errors.cityId) {
    const nameNorm = normalize(name);
    const cityNorm = normalize(cityName || String(cityId));

    const duplicate = existing.find(item => {
      if (!item || !item.name) return false;
      if (currentId && item.id === currentId) return false;

      const itemCity = normalize(item.cityName || item.cityId);
      return itemCity === cityNorm && normalize(item.name) === nameNorm;
    });

    if (duplicate) {
      errors.name = i18n.t("validation:duplicate");
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export default {
  validateLocationForm,
  validateLocationName,
  validateCity
};
