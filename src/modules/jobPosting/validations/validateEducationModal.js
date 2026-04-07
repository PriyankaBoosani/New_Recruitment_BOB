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

    // ✅ NEW: GPA validation
    if (row.gpa !== "") {
      const gpa = parseFloat(row.gpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        rowErrors.gpa = "validation:gpa_range";
      }
    }

    // ✅ NEW: Percentage validation
    if (row.percentage !== "") {
      const per = parseFloat(row.percentage);
      if (isNaN(per) || per < 0 || per > 100) {
        rowErrors.percentage = "validation:percentage_range";
      }
    }

    // ✅ NEW: Duration validation
    if (row.duration !== "") {
      const dur = parseInt(row.duration);
      if (isNaN(dur) || dur < 0) {
        rowErrors.duration = "validation:duration_invalid";
      }
    }

    if (Object.keys(rowErrors).length > 0) {
      errors.rows[i] = rowErrors;
    }
  });

if (errors.rows.every(row => !row || Object.keys(row).length === 0)) {
  return {};
}
  return errors;
};