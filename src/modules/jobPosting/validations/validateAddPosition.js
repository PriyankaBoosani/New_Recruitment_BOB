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
  // ---------- AGE BUSINESS RULES (BANK ELIGIBILITY) ----------

const minAge = Number(formData.minAge);
const maxAge = Number(formData.maxAge);

// Minimum age rule
if (!errors.minAge && minAge < 18) {
  errors.minAge = "Minimum age must be 18 years";
}

// Maximum age rule
if (!errors.maxAge && maxAge > 60) {
  errors.maxAge = "Maximum age must not exceed 60 years";
}

// Logical relationship
if (
  !errors.minAge &&
  !errors.maxAge &&
  minAge >= maxAge
) {
  errors.maxAge = "Max age must be greater than Min age";
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

  // ---------- STATE / NATIONAL DISTRIBUTION ----------

  if (formData.enableStateDistribution) {
    const activeStates = stateDistributions.filter(s => !s.__deleted);

    if (activeStates.length === 0) {
      errors.nationalDistribution = "This field is required";
    } else {
      const stateTotal = activeStates.reduce(
        (sum, s) => sum + Number(s.vacancies || 0),
        0
      );

      const vacancies = Number(formData.vacancies || 0);

      if (stateTotal !== vacancies) {
        errors.nationalDistribution =
          `Total state vacancies (${stateTotal}) must equal total vacancies (${vacancies})`;
      }
    }
  }
  else {
    // NATIONAL MODE

    const categoryTotal = Object.values(nationalCategories || {})
      .reduce((sum, v) => sum + Number(v || 0), 0);

    const disabilityTotal = Object.values(nationalDisabilities || {})
      .reduce((sum, v) => sum + Number(v || 0), 0);

    const vacancies = Number(formData.vacancies || 0);

    if (categoryTotal === 0) {
      errors.nationalDistribution = "This field is required";
    }
    else if (categoryTotal !== vacancies) {
      errors.nationalDistribution =
        `Category total (${categoryTotal}) must equal total vacancies (${vacancies})`;
    }
    else if (disabilityTotal > categoryTotal) {
      errors.nationalDistribution =
        "Disability vacancies cannot exceed category vacancies";
    }

  }






  return errors;
};

export const validateStateDistribution = ({
  currentState,
  stateDistributions,
  editingIndex
}) => {
  const errors = {};

  if (!currentState.state) {
    errors.state = "This field is required";
  }

  if (!currentState.vacancies) {
    errors.stateVacancies = "This field is required";
  }

  if (!currentState.language) {
    errors.stateLanguage = "This field is required";
  }

  const catTotal = Object.values(currentState.categories || {})
    .reduce((a, b) => a + Number(b || 0), 0);

  const disTotal = Object.values(currentState.disabilities || {})
    .reduce((a, b) => a + Number(b || 0), 0);

  const vacancies = Number(currentState.vacancies || 0);

  if (catTotal !== vacancies) {
    errors.stateDistribution = "Category total must match vacancies";
  }
  else if (disTotal > vacancies) {
    errors.stateDistribution =
      "Disability vacancies cannot exceed total vacancies";
  }



  const duplicate = stateDistributions.some(
    (s, i) =>
      s.state === currentState.state &&
      !s.__deleted &&
      i !== editingIndex
  );

  if (duplicate) {
    errors.state = "This state is already added";
  }

  
  return errors;
};

