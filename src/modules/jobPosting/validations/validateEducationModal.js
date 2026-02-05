export const validateEducationModal = ({ rows }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    if (!row.educationTypeId) {
       rowErrors.educationTypeId = "validation:required";
    }

    if (!row.educationQualificationsId) {
      rowErrors.educationQualificationsId = "validation:required";
    }

    if (Object.keys(rowErrors).length) {
      errors.rows[i] = rowErrors;
    }
  });

  if (!errors.rows.length) return {};
  return errors;
};
