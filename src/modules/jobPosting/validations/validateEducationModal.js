export const validateEducationModal = ({ rows, mode }) => {
  const errors = { rows: [] };

  const filledRows = rows.filter(
    r => r.educationTypeId || r.educationQualificationsId
  );

  rows.forEach((row, i) => {
    const rowErrors = {};

    const isPartiallyFilled =
      row.educationTypeId || row.educationQualificationsId;

    // Only validate if user started filling
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

  // Mandatory must have at least one fully filled row
  const fullyFilledRows = rows.filter(
    r => r.educationTypeId && r.educationQualificationsId
  );

  if (mode === "mandatory" && fullyFilledRows.length === 0) {
    errors.rows._error = "validation:degree_required";
  }

  if (!errors.rows.length && !errors.rows._error) return {};
  return errors;
};
