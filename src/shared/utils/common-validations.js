/**
 * Common validation functions (i18n-safe)
 */
 
export const requiredField = (value, fieldKey = 'common.field') => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ''
  ) {
    return `${fieldKey}.required`;
  }
  return null;
};
 
export const minLength = (value, min, fieldKey = 'common.field') => {
  if (value !== undefined && value !== null) {
    if (String(value).length < min) {
      return `${fieldKey}.minLength:${min}`;
    }
  }
  return null;
};
 
export const maxLength = (value, max, fieldKey = 'common.field') => {
  if (value !== undefined && value !== null) {
    if (String(value).length > max) {
      return `${fieldKey}.maxLength:${max}`;
    }
  }
  return null;
};
 
export const emailFormat = (email) => {
  if (!email) return null;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email))
    ? null
    : `common.email.invalid`;
};
 
export const phoneFormat = (phone) => {
  if (!phone) return null;
  return /^[0-9]{10}$/.test(String(phone))
    ? null
    : `common.phone.invalid`;
};
 
 
 
 
 
 
 
 
 
 
 
 
 
// /**
//  * Common validation functions that can be reused across the application
//  */
 
// export const requiredField = (value, fieldName) => {
//   if (!value || value.trim() === '') {
//     return `${fieldName} is required`;
//   }
//   return null;
// };
 
// export const minLength = (value, min, fieldName) => {
//   if (value && value.length < min) {
//     return `${fieldName} must be at least ${min} characters`;
//   }
//   return null;
// };
 
// export const maxLength = (value, max, fieldName) => {
//   if (value && value.length > max) {
//     return `${fieldName} must be at most ${max} characters`;
//   }
//   return null;
// };
 
// export const emailFormat = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (email && !emailRegex.test(email)) {
//     return 'Please enter a valid email address';
//   }
//   return null;
// };
 
// export const phoneFormat = (phone) => {
//   const phoneRegex = /^[0-9]{10}$/;
//   if (phone && !phoneRegex.test(phone)) {
//     return 'Please enter a valid 10-digit phone number';
//   }
//   return null;
// };
 
 