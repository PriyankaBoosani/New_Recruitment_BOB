export const validateEducationModal = ({ rows, mode }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    const hasType = !!row.educationTypeId;
    const hasDegree = !!row.educationQualificationsId;
    const isPartiallyFilled = hasType || hasDegree;

    // ✅ Numeric validation
    validateNumericFields(row, rowErrors);

    // ✅ Education validation
    validateEducationFields(
      mode,
      hasType,
      hasDegree,
      isPartiallyFilled,
      rowErrors
    );

    if (Object.keys(rowErrors).length > 0) {
      errors.rows[i] = rowErrors;
    }
  });

  if (errors.rows.every(row => !row || Object.keys(row).length === 0)) {
    return {};
  }

  return errors;
};

const validateNumericFields = (row, rowErrors) => {
  // Percentage
  if (row.percentage !== "") {
    const per = parseFloat(row.percentage);
    if (isNaN(per) || per < 0 || per > 100) {
      rowErrors.percentage = "validation:percentage_range";
    }
  }

  // Duration
  if (row.duration !== "") {
    const dur = parseInt(row.duration);
    if (isNaN(dur) || dur < 0) {
      rowErrors.duration = "validation:duration_invalid";
    }
  }
};

const validateEducationFields = (mode, hasType, hasDegree, isPartiallyFilled, rowErrors) => {
  const shouldValidate =
    mode === "mandatory" ||
    (mode === "preferred" && isPartiallyFilled);

  if (!shouldValidate) return;

  if (!hasType) {
    rowErrors.educationTypeId = "validation:required";
  }

  if (!hasDegree) {
    rowErrors.educationQualificationsId = "validation:required";
  }
};