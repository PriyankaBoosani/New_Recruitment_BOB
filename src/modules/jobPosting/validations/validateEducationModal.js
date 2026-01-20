export const validateEducationModal = ({ rows }) => {
  const errors = { rows: [] };

  rows.forEach((row, i) => {
    const rowErrors = {};

    if (!row.educationTypeId) {
      rowErrors.educationTypeId = "Education type is required";
    }

    if (!row.educationQualificationsId) {
      rowErrors.educationQualificationsId = "Degree is required";
    }

    if (Object.keys(rowErrors).length) {
      errors.rows[i] = rowErrors;
    }
  });

  if (!errors.rows.length) return {};
  return errors;
};
