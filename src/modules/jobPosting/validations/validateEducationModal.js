export const validateEducationModal = ({ rows, mode }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    const hasType = !!row.educationTypeId;
    const hasDegree = !!row.educationQualificationsId;
    const isPartiallyFilled = hasType || hasDegree;

    // 🔹 Mandatory mode → always validate
    if (mode === "mandatory") {
      if (!hasType) {
        rowErrors.educationTypeId = "validation:required";
      }
      if (!hasDegree) {
        rowErrors.educationQualificationsId = "validation:required";
      }
    }

    // 🔹 Preferred mode → validate only if user started filling
    if (mode === "preferred" && isPartiallyFilled) {
      if (!hasType) {
        rowErrors.educationTypeId = "validation:required";
      }
      if (!hasDegree) {
        rowErrors.educationQualificationsId = "validation:required";
      }
    }

    if (Object.keys(rowErrors).length > 0) {
      errors.rows[i] = rowErrors;
    }
  });

  if (!errors.rows.length) return {};
  return errors;
};