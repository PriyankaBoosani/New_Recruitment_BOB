// src/validators/category-validations.js

const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

export function validateCode(code, { existing = [], currentId = null } = {}) {
    const c = String(code || '').trim();

    if (isEmpty(c)) return "Code is required";
    if (c.length < 2) return "Code must be at least 2 characters";
    if (c.length > 20) return "Code must be less than 20 characters";

    const exists = existing.find(
        x => x.code.toLowerCase() === c.toLowerCase() && x.id !== currentId
    );
    if (exists) return "Code must be unique";

    return null;
}

export function validateName(name) {
    const n = String(name || '').trim();

    if (isEmpty(n)) return "Name is required";
    if (n.length < 2) return "Name must be at least 2 characters";
    if (n.length > 100) return "Name must be under 100 characters";

    return null;
}

export function validateDescription(desc) {
    if (isEmpty(desc)) return null;
    const d = String(desc);

    if (d.length > 500) return "Description must be under 500 characters";
    return null;
}

export function validateCategoryForm(formData, options = {}) {
    const errors = {};

    const codeErr = validateCode(formData.code, options);
    if (codeErr) errors.code = codeErr;

    const nameErr = validateName(formData.name);
    if (nameErr) errors.name = nameErr;

    const descErr = validateDescription(formData.description);
    if (descErr) errors.description = descErr;

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

export default {
    validateCategoryForm,
    validateCode,
    validateName,
    validateDescription
};