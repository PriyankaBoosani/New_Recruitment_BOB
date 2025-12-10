import { requiredField, minLength, maxLength, emailFormat, phoneFormat } from './common-validations';

/**
 * Normalize a string for comparison (trim + lowercase)
 * @param {string} str - The string to normalize
 * @returns {string} Normalized string
 */
const normalizeString = (str = '') => String(str).trim().toLowerCase();

/**
 * Validate user role
 * @param {string} role - The role to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUserRole = (role) => {
  return requiredField(role, 'Role');
};

/**
 * Validate user's full name
 * @param {string} name - The name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateFullName = (name) => {
  let error = requiredField(name, 'Full name');
  if (error) return error;
  
  error = minLength(name, 2, 'Full name');
  if (error) return error;
  
  error = maxLength(name, 100, 'Full name');
  if (error) return error;
  
  return null;
};

/**
 * Validate user email
 * @param {string} email - The email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUserEmail = (email) => {
  let error = requiredField(email, 'Email');
  if (error) return error;
  
  error = emailFormat(email);
  if (error) return error;
  
  return null;
};

/**
 * Validate user mobile number
 * @param {string} mobile - The mobile number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUserMobile = (mobile) => {
  let error = requiredField(mobile, 'Mobile number');
  if (error) return error;
  
  error = phoneFormat(mobile);
  if (error) return error;
  
  return null;
};

/**
 * Validate user password
 * @param {string} password - The password to validate
 * @param {boolean} [isRequired=true] - Whether the password is required
 * @returns {string|null} Error message or null if valid
 */
export const validateUserPassword = (password, isRequired = true) => {
  if (!isRequired && !password) return null;
  
  let error = requiredField(password, 'Password');
  if (error) return error;
  
  error = minLength(password, 6, 'Password');
  if (error) return error;
  
  return null;
};

/**
 * Validate password confirmation
 * @param {string} confirmPassword - The confirmed password
 * @param {string} password - The original password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (confirmPassword, password) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== password) return 'Passwords do not match';
  return null;
};

/**
 * Validate user form data with optional uniqueness check
 * @param {Object} formData - The form data to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.requirePassword=true] - Whether password is required
 * @param {Array} [options.existing=[]] - Existing users for uniqueness check
 * @param {number|null} [options.currentId=null] - Current user ID (for edit operations)
 * @returns {{valid: boolean, errors: Object}} Validation result
 */
export const validateUserForm = (formData = {}, options = {}) => {
  const {
    requirePassword = true,
    existing = [],
    currentId = null
  } = options;
  
  const errors = {};

  // Validate role
  const roleError = validateUserRole(formData.role);
  if (roleError) errors.role = roleError;

  // Validate full name
  const nameError = validateFullName(formData.fullName);
  if (nameError) errors.fullName = nameError;

  // Validate email
  const emailError = validateUserEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  } else {
    // Check for duplicate email (only if email is valid)
    const emailNorm = normalizeString(formData.email);
    const duplicateEmail = existing.find(user => 
      user.email && 
      normalizeString(user.email) === emailNorm && 
      user.id !== currentId
    );
    if (duplicateEmail) {
      errors.email = 'This email is already in use';
    }
  }

  // Validate mobile
  const mobileError = validateUserMobile(formData.mobile);
  if (mobileError) {
    errors.mobile = mobileError;
  } else {
    // Check for duplicate mobile (only if mobile is valid)
    const mobileNorm = formData.mobile.replace(/\D/g, '');
    const duplicateMobile = existing.find(user => 
      user.mobile && 
      user.mobile.replace(/\D/g, '') === mobileNorm && 
      user.id !== currentId
    );
    if (duplicateMobile) {
      errors.mobile = 'This mobile number is already in use';
    }
  }

  // Validate password if required
  if (requirePassword || formData.password) {
    const passwordError = validateUserPassword(formData.password, requirePassword);
    if (passwordError) {
      errors.password = passwordError;
    } else if (formData.password) {
      // Only validate confirmation if password is provided and valid
      const confirmError = validatePasswordConfirmation(
        formData.confirmPassword, 
        formData.password
      );
      if (confirmError) {
        errors.confirmPassword = confirmError;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateUserRole,
  validateFullName,
  validateUserEmail,
  validateUserMobile,
  validateUserPassword,
  validatePasswordConfirmation,
  validateUserForm,
};
