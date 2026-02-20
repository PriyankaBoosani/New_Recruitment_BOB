export const validateEducationModal = ({ rows, mode }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    const isPartiallyFilled =
      row.educationTypeId || row.educationQualificationsId;

    // If user started filling row → validate normally
    if (isPartiallyFilled) {
      if (!row.educationTypeId) {
        rowErrors.educationTypeId = "validation:required";
      }

      if (!row.educationQualificationsId) {
        rowErrors.educationQualificationsId = "validation:required";
      }
    }

    if (Object.keys(rowErrors).length) {
      errors.rows[i] = rowErrors;
    }
  });

  const fullyFilledRows = rows.filter(
    r => r.educationTypeId && r.educationQualificationsId
  );

  // 🚨 If mandatory and nothing selected at all
  if (mode === "mandatory" && fullyFilledRows.length === 0) {
    errors.rows[0] = {
      educationTypeId: "validation:required",
      educationQualificationsId: "validation:required"
    };
  }

  if (!errors.rows.length) return {};
  return errors;
};