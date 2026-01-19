// validations/jobpostingcommonvalidators.js
export const validatePositiveInteger = ({
  value,
  fieldName,
  required = true,
  allowZero = false,
}) => {
  const trimmed = String(value ?? "").trim();

  if (required && trimmed === "") {
    return `This feild is required`;
  }

  if (trimmed === "") return null; // optional & empty is OK

  if (!/^\d+$/.test(trimmed)) {
    return `${fieldName} must contain only numbers`;
  }

  const num = Number(trimmed);

  if (!allowZero && num <= 0) {
    return `${fieldName} must be greater than zero`;
  }

  return null;
};


