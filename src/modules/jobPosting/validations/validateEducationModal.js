export const validateEducationModal = ({ rows, certs }) => {
  const errors = {
    rows: [],
    certs: []
  };

  // ---- DEGREE ROW VALIDATION ----
  const validRows = rows.filter(
    r => r.degree || r.specialization
  );

  if (validRows.length === 0) {
    errors.general = "At least one degree is required";
  }

  rows.forEach((row, index) => {
    const rowErrors = {};

    if (index > 0 && !row.operator) {
      rowErrors.operator = "Operator is required";
    }

    if (!row.type) {
      rowErrors.type = "Type is required";
    }

    if (!row.degree) {
      rowErrors.degree = "Degree is required";
    }

    if (!row.specialization) {
      rowErrors.specialization = "Specialization is required";
    }

    errors.rows[index] = rowErrors;
  });

  // ---- CERTIFICATION VALIDATION (OPTIONAL BUT NON-EMPTY) ----
  certs.forEach((c, index) => {
    if (c && !c.trim()) {
      errors.certs[index] = "Certification cannot be empty";
    }
  });

  // ---- CLEAN EMPTY ERROR OBJECTS ----
  const hasRowErrors = errors.rows.some(r => Object.keys(r).length);
  const hasCertErrors = errors.certs.some(Boolean);

  if (!hasRowErrors) delete errors.rows;
  if (!hasCertErrors) delete errors.certs;
  if (!errors.general) delete errors.general;

  return errors;
};
