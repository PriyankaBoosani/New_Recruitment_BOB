export const validateEducationModal = ({ rows }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    if (!row.educationTypeId) {
      rowErrors.educationTypeId = "This field is required";
    }

    if (!row.educationQualificationsId) {
      rowErrors.educationQualificationsId = "This field is required";
    }

    if (Object.keys(rowErrors).length) {
      errors.rows[i] = rowErrors;
    }
  });

  if (!errors.rows.length) return {};
  return errors;
};
