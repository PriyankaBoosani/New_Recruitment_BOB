export const validateEducationModal = ({ rows, certs }) => {
  const errors = {
    rows: [],
  };

  // ---- AT LEAST ONE COMPLETE EDUCATION REQUIRED ----
  const validRows = rows.filter(
    r =>
      r.educationTypeId &&
      r.educationQualificationsId &&
      r.specializationId
  );

  if (validRows.length === 0) {
    errors.general = "At least one education requirement is required";
  }

  // ---- ROW LEVEL VALIDATION ----
  rows.forEach((row, index) => {
    const rowErrors = {};

    if (index > 0 && !row.operator) {
      rowErrors.operator = "Operator is required";
    }

    if (!row.educationTypeId) {
      rowErrors.educationTypeId = "Education type is required";
    }

    if (!row.educationQualificationsId) {
      rowErrors.educationQualificationsId = "Qualification is required";
    }

    if (!row.specializationId) {
      rowErrors.specializationId = "Specialization is required";
    }

    if (Object.keys(rowErrors).length > 0) {
      errors.rows[index] = rowErrors;
    }
  });

  // ---- CERTIFICATIONS (UUIDs ONLY) ----
  if (Array.isArray(certs)) {
    const invalidCerts = certs.filter(
      c => !c || typeof c !== "string"
    );

    if (invalidCerts.length > 0) {
      errors.certs = "Invalid certification selected";
    }
  }

  // ---- CLEANUP EMPTY STRUCTURES ----
  if (!errors.rows.some(Boolean)) delete errors.rows;
  if (!errors.general) delete errors.general;

  return errors;
};
