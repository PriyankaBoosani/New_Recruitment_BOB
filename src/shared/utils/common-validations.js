import i18n from '../../i18n/i18n';

/* ---------------- Basic Helpers ---------------- */

export const requiredField = (value) => {
  // treat undefined / null as missing
  if (value === undefined || value === null) return i18n.t('validation:required');

  // strings: trim and check
  if (typeof value === 'string') {
    if (value.trim() === '') return i18n.t('validation:required');
    return null;
  }

  // arrays: empty array => missing
  if (Array.isArray(value)) {
    if (value.length === 0) return i18n.t('validation:required');
    return null;
  }

  // numbers: NaN => missing (0 is a valid value)
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return i18n.t('validation:required');
    return null;
  }
  
  return null;

  // booleans: consider false a valid value (change if you want false -> required)
  if (typeof value === "boolean") return null;

  // fallback: convert to string and check
  if (String(value).trim() === "") return i18n.t('validation:required');

  return null;
};

// Check min length (for strings/arrays)
export const minLength = (value, min) => {
  if (value === undefined || value === null) return null;
  
  const length = typeof value === 'string' 
    ? value.trim().length 
    : Array.isArray(value) 
      ? value.length 
      : 0;
      
  return length >= min ? null : i18n.t('validation:minLength', { min });
};

// Check max length (for strings/arrays)
export const maxLength = (value, max) => {
  if (!value) return null;
  
  const length = typeof value === 'string' 
    ? value.trim().length 
    : Array.isArray(value) 
      ? value.length 
      : 0;
      
  return length <= max ? null : i18n.t('validation:maxLength', { max });
};

export const emailFormat = (email) => {
  if (!email) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return i18n.t('validation:email');
  }
  return null;
};

export const phoneFormat = (phone) => {
  if (!phone) return null;
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return i18n.t('validation:phone');
  }
  return null;
};


/* ---------------- Generic Job/Department Validation ---------------- */

const normalizeName = (s = "") => s.trim().toLowerCase();

export const ValidateForm = (formData = {}, options = {}) => {
  const errors = {};
  const { existing = [], currentId = null } = options;
  const { t } = i18n;

  // name
  let err = requiredField(formData.name);
  if (!err) err = minLength(formData.name, 2);
  if (!err) err = maxLength(formData.name, 100);
  if (err) errors.name = err;

  // description
  let descErr = requiredField(formData.description);
  if (!descErr) descErr = minLength(formData.description, 10);
  if (!descErr) descErr = maxLength(formData.description, 500);
  if (descErr) errors.description = descErr;

  //cityId
  let cityErr = requiredField(formData.cityId);
  if (cityErr) errors.cityId = cityErr;

  let scaleErr = requiredField(formData.scale);
  if (scaleErr) errors.scale = scaleErr;

  let gradeCodeErr = requiredField(formData.gradeCode);
  if (gradeCodeErr) errors.gradeCode = gradeCodeErr;

  let minSalaryErr = requiredField(formData.minSalary);
  if (minSalaryErr) errors.minSalary = minSalaryErr;

  let maxSalaryErr = requiredField(formData.maxSalary);
  if (maxSalaryErr) errors.maxSalary = maxSalaryErr;

  let titleErr = requiredField(formData.title);
  if (titleErr) errors.title = titleErr;

  let departmentErr = requiredField(formData.department);
  if (departmentErr) errors.department = departmentErr;

  let jobGradeErr = requiredField(formData.jobGrade);
  if (jobGradeErr) errors.jobGrade = jobGradeErr;

  let codeErr = requiredField(formData.code);
  if (codeErr) errors.code = codeErr;

  let operatorErr = requiredField(formData.operator);
  if (operatorErr) errors.operator = operatorErr;

  let inputTypeErr = requiredField(formData.inputType);
  if (inputTypeErr) errors.inputType = inputTypeErr;

  // uniqueness (only if name valid)
  if (!errors.name && formData.name) {
    const nameNorm = normalizeName(formData.name);
    const duplicate = existing.find((d) => {
      if (currentId != null && d.id === currentId) return false;
      return normalizeName(d.name) === nameNorm;
    });

    if (duplicate) {
      errors.name = t('validation:nameExists');
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};


export const ValidateDepartment = (formData = {}, existing = [], currentId = null) => {
  const errors = {};
  const { t } = i18n;

  // name validation
  let err = requiredField(formData.name);
  if (!err) err = minLength(formData.name, 2);
  if (!err) err = maxLength(formData.name, 100);
  if (err) {
    errors.name = err;
  } else {
    // Check for duplicate names only if name is valid
    const nameNorm = formData.name.trim().toLowerCase();
    const duplicate = existing.find(d => {
      if (currentId && d.id === currentId) return false;
      return d.name.trim().toLowerCase() === nameNorm;
    });

    if (duplicate) errors.name = t('validation:nameExists');
  }

  // description validation
  const descErr = requiredField(formData.description) || 
                 minLength(formData.description, 10) || 
                 maxLength(formData.description, 500);
  if (descErr) errors.description = descErr;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};


export const ValidateInterviewPanel = (formData = {}) => {
  const errors = {};

  // Normalize members: if array, keep; if string, split & trim to array
  let membersArray = [];
  if (Array.isArray(formData.members)) {
    membersArray = formData.members.map(m => String(m || '').trim()).filter(Boolean);
  } else if (typeof formData.members === 'string') {
    membersArray = formData.members.split(',').map(x => x.trim()).filter(Boolean);
  }

  // name required + min/max length
  const nameErr = requiredField(formData.name);
  if (nameErr) {
    errors.name = nameErr;
  } else {
    const mn = minLength(formData.name, 2);
    if (mn) errors.name = mn;
    const mx = maxLength(formData.name, 100);
    if (mx) errors.name = mx;
  }

  // members required (array must have at least one)
  const membersErr = requiredField(membersArray);
  if (membersErr) errors.members = 'At least one member must be selected';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    // return normalized members for convenience (component can use this if desired)
    normalized: { name: formData.name ? String(formData.name).trim() : '', members: membersArray }
  };
};

export const ValidateUser = (formData = {}, options = {}) => {
  const errors = {};
  const { requirePassword = true, existing = [], currentId = null } = options;

  // role
  const roleErr = requiredField(formData.role);
  if (roleErr) errors.role = roleErr;

  // fullName (you used fullName in your component)
  const fullNameErr = requiredField(formData.fullName);
  if (fullNameErr) {
    errors.fullName = fullNameErr;
  } else {
    const mn = minLength(formData.fullName, 2);
    if (mn) errors.fullName = mn;
    const mx = maxLength(formData.fullName, 100);
    if (mx) errors.fullName = mx;
  }

  // email: required + format + uniqueness
  const emailErr = requiredField(formData.email);
  if (emailErr) {
    errors.email = emailErr;
  } else {
    const fmt = emailFormat(formData.email);
    if (fmt) errors.email = fmt;
    else {
      // uniqueness (only if valid format)
      const emailNorm = String(formData.email).trim().toLowerCase();
      const duplicate = existing.find(u => {
        if (currentId != null && u.id === currentId) return false;
        return String(u.email || '').trim().toLowerCase() === emailNorm;
      });
      if (duplicate) errors.email = 'Email already exists';
    }
  }

  // mobile: required + phone format + uniqueness optional
  const mobileErr = requiredField(formData.mobile);
  if (mobileErr) {
    errors.mobile = mobileErr;
  } else {
    const pf = phoneFormat(formData.mobile);
    if (pf) errors.mobile = pf;
    else {
      const mobileNorm = String(formData.mobile).trim();
      const duplicateMobile = existing.find(u => {
        if (currentId != null && u.id === currentId) return false;
        return String(u.mobile || '').trim() === mobileNorm;
      });
      if (duplicateMobile) errors.mobile = 'Mobile number already exists';
    }
  }

  // password: required depending on options (e.g. new user requires password)
  // example rules: min 8 chars. Add complexity rules if you want.
  if (requirePassword) {
    const pwdErr = requiredField(formData.password);
    if (pwdErr) {
      errors.password = pwdErr;
    } else {
      const pmin = minLength(formData.password, 8);
      if (pmin) errors.password = pmin;
      // optional: complexity: contains number + letter
      // if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      //   errors.password = 'Password must contain letters and numbers';
      // }
    }
  } else if (formData.password) {
    // If password provided while editing, still validate min length
    const pmin = minLength(formData.password, 8);
    if (pmin) errors.password = pmin;
  }

  // confirmPassword must match password when password present or required
  const pwdToCheck = String(formData.password || '');
  const confirmPwd = String(formData.confirmPassword || '');
  if ((requirePassword || pwdToCheck !== '') && confirmPwd !== pwdToCheck) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};


export default {
  requiredField,
  minLength,
  maxLength,
  emailFormat,
  phoneFormat,
  ValidateForm,
  ValidateInterviewPanel,
  ValidateUser,
};
