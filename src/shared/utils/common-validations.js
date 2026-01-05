/**
 * Common validation functions that can be reused across the application
 */
 
import i18n from 'i18next';
 
// export const requiredField = (value) => {
//   if (!value || value.trim() === '') {
//     return i18n.t('validation:required');
//   }
//   return null;
// };
 

export const requiredField = (value) => {
  if (value === null || value === undefined) {
    return i18n.t("validation:required");
  }

  // If string → trim
  if (typeof value === "string" && value.trim() === "") {
    return i18n.t("validation:required");
  }

  return null;
};
export const minLength = (value, min) => {
  if (value && value.length < min) {
    return i18n.t('validation:minLength', { min });
  }
  return null;
};
 
export const maxLength = (value, max) => {
  if (value && value.length > max) {
    return i18n.t('validation:maxLength', { max });
  }
  return null;
};
 
export const emailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return i18n.t('validation:invalidEmail');
  }
  return null;
};
 
export const phoneFormat = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    return i18n.t('validation:invalidPhone');
  }
  return null;
};

export const cleanData = (value) => {
  if (value !== null && typeof value === "string") {
    return value.trim();
  }
  return value;
}
