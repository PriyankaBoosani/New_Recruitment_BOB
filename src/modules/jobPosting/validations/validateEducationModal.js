export const validateEducationModal = ({ rows, certs }) => {
  const errors = {};

  // ---- KEEP ONLY COMPLETE ROWS ----
  const filledRows = rows.filter(
    r =>
      r.educationTypeId &&
      r.educationQualificationsId &&
      r.specializationId
  );

  // ---- AT LEAST ONE DEGREE REQUIRED ----
  if (filledRows.length === 0) {
    errors.general = "At least one education requirement is required";
    return errors;
  }

  // ---- ROW LEVEL VALIDATION (ONLY FILLED ROWS) ----
  filledRows.forEach((row, index) => {
    const rowErrors = {};

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
      if (!errors.rows) errors.rows = {};
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

  return errors;
};
