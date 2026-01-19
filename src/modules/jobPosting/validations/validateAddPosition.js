import { validatePositiveInteger } from "./JobpostingcommonValidators";

export const validateAddPosition = ({
  isEditMode,
  formData,
  educationData,
  indentFile,
  existingIndentPath,
  approvedBy,
  approvedOn,
  nationalCategories,
  nationalDisabilities,
  stateDistributions
}) => {
  const errors = {};

  // ---------- FILE ----------
  if (!indentFile && !(isEditMode && existingIndentPath)) {
    errors.indentFile = "Indent file is required";
  }

  // ---------- BASIC REQUIRED ----------
  if (!approvedBy) errors.approvedBy = "This field is required";
  if (!approvedOn) errors.approvedOn = "This field is required";
  if (!formData.position) errors.position = "This field is required";
  if (!formData.department) errors.department = "This field is required";
  if (!formData.employmentType) errors.employmentType = "This field is required";
  if (!formData.grade) errors.grade = "This field is required";
  if (!formData.medicalRequired) errors.medicalRequired = "This field is required";

  // ---------- NUMERIC FIELDS ----------
  const numericChecks = [
    ["vacancies", "Vacancies"],
    ["minAge", "Min age"],
    ["maxAge", "Max age"],
  ];

  numericChecks.forEach(([key, label]) => {
    const err = validatePositiveInteger({
      value: formData[key],
      fieldName: label,
    });
    if (err) errors[key] = err;
  });

  // contractualPeriod is optional
  const contractErr = validatePositiveInteger({
    value: formData.contractualPeriod,
    fieldName: "Contractual period",
    required: false,
    allowZero: true,
  });
  if (contractErr) errors.contractualPeriod = contractErr;

  // ---------- AGE LOGIC ----------
  if (
    !errors.minAge &&
    !errors.maxAge &&
    Number(formData.minAge) >= Number(formData.maxAge)
  ) {
    errors.maxAge = "Max age must be greater than Min age";
  }

  // ---------- EDUCATION ----------
  if (!educationData.mandatory.text?.trim()) {
    errors.mandatoryEducation = "This field is required";
  }

  if (!educationData.preferred.text?.trim()) {
    errors.preferredEducation = "This field is required";
  }

  // ---------- EXPERIENCE ----------
  const validateExperience = (exp, key) => {
    const years = Number(exp.years || 0);
    const months = Number(exp.months || 0);

    if (years === 0 && months === 0) {
      errors[key] = "Please select experience duration";
    } else if (!exp.description?.trim()) {
      errors[key] = "Please enter experience details";
    }
  };

  validateExperience(formData.mandatoryExperience, "mandatoryExperience");
  validateExperience(formData.preferredExperience, "preferredExperience");

  // ---------- RESPONSIBILITIES ----------
  if (!formData.responsibilities?.trim()) {
    errors.responsibilities = "This field is required";
  }

  // ---------- NATIONAL / STATE DISTRIBUTION (REQUIRED) ----------
if (formData.enableStateDistribution) {
  // STATE WISE
  if (!stateDistributions || stateDistributions.length === 0) {
    errors.nationalDistribution = "This field is required";
  }
} else {
  // NATIONAL WISE
  const nationalCatTotal = Object.values(nationalCategories || {})
    .reduce((sum, v) => sum + Number(v || 0), 0);

  const nationalDisTotal = Object.values(nationalDisabilities || {})
    .reduce((sum, v) => sum + Number(v || 0), 0);

  if (nationalCatTotal === 0 && nationalDisTotal === 0) {
    errors.nationalDistribution = "This field is required";
  }
}

// ---------- NATIONAL DISTRIBUTION ----------
if (!formData.enableStateDistribution) {
  const generalTotal = Object.values(nationalCategories || {})
    .reduce((sum, v) => sum + Number(v || 0), 0);

  const disabilityTotal = Object.values(nationalDisabilities || {})
    .reduce((sum, v) => sum + Number(v || 0), 0);

  const total = generalTotal + disabilityTotal;
  const vacancies = Number(formData.vacancies || 0);

  if (total !== vacancies) {
    errors.nationalDistribution =
      `National distribution total (${total}) must equal total vacancies (${vacancies})`;
  }
}





  return errors;
};
