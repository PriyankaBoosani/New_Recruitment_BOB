import { validatePositiveInteger } from "./JobpostingcommonValidators";



export const normalizeTitle = (value = "") =>
  value
    .replace(/[ \t]+/g, " ")   // collapse only spaces & tabs
    .replace(/^\s+/, "");

export const TITLE_ALLOWED_PATTERN = /^[A-Za-z0-9 _.,\-():;'&/\n\r]*$/;

export const validateTitleOnType = (value) => {
  const normalized = normalizeTitle(value);

  if (!TITLE_ALLOWED_PATTERN.test(normalized)) {
    return {
      valid: false,
      message: "validation:title_invalid_chars_extended"

    };
  }

  return {
    valid: true,
    value: normalized
  };
};

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
  stateDistributions,
  existingPositions,
  positionId
}) => {
  const errors = {};

  // ---------- FILE ----------
  if (!indentFile && !(isEditMode && existingIndentPath)) {
    errors.indentFile = "validation:required";
  }

  // ---------- BASIC REQUIRED ----------
  if (!approvedBy) errors.approvedBy = "validation:required";
  const approvedOnError = validateApprovedOn(approvedOn);
  if (approvedOnError) {
    errors.approvedOn = approvedOnError;
  }
  if (!formData.position) errors.position = "validation:required";
  if (!formData.department) errors.department = "validation:required";
  if (!formData.employmentType) errors.employmentType = "validation:required";
  if (!formData.grade) errors.grade = "validation:required";
  if (!formData.medicalRequired) errors.medicalRequired = "validation:required";
  if (!formData.cutOffDate) errors.cutOffDate = "validation:required";

  // ---------- DUPLICATE POSITION + DEPARTMENT ----------
  if (
    formData.position &&
    formData.department &&
    Array.isArray(existingPositions)
  ) {
    const duplicate = existingPositions.some(p => {
      const sameDepartment =
        String(p.deptId) === String(formData.department);

      const samePosition =
        String(p.masterPositionId) === String(formData.position);

      const notSameRecord =
        !isEditMode || String(p.positionId) !== String(positionId);

      return sameDepartment && samePosition && notSameRecord;
    });

    if (duplicate) {
      errors.position = "validation:duplicate_position_department";
      errors.department = "validation:duplicate_department_position";
    }
  }

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
    errors.maxAge = "validation:max_greater_than_min_age";
  }

  // ---------- EDUCATION ----------
  if (!educationData.mandatory.text?.trim()) {
    errors.mandatoryEducation = "validation:required";
  }


  // ---------- AGE BUSINESS RULES (BANK ELIGIBILITY) ----------

  const minAge = Number(formData.minAge);
  const maxAge = Number(formData.maxAge);

  // Minimum age rule
  if (!errors.minAge && minAge < 18) {
    errors.minAge = "validation:min_age_18";
  }

  // Maximum age rule
  if (!errors.maxAge && maxAge > 60) {
    errors.maxAge = "validation:max_age_60";
  }

  // Logical relationship
  if (
    !errors.minAge &&
    !errors.maxAge &&
    minAge >= maxAge
  ) {
    errors.maxAge = "validation:max_greater_than_min_age";
  }


  // ---------- EXPERIENCE ----------
  const validateExperience = (exp, key) => {
    const years = exp.years === "" ? null : Number(exp.years);
    const months = exp.months === "" ? null : Number(exp.months);

    // Only error if BOTH are not selected (empty)
    if (years === null && months === null) {
      errors[key] = "validation:experience_duration_required";
      return;
    }

    if (!exp.description?.trim()) {
      errors[key] = "validation:experience_details_required";
    }
  };


  //validateExperience(formData.mandatoryExperience, "mandatoryExperience");

  if (!formData.useMandatoryEducationLevelExperience) {
  // OLD logic (toggle OFF)
  validateExperience(formData.mandatoryExperience, "mandatoryExperience");
} else {
  // NEW logic (toggle ON)

  const eduExps = formData.mandatoryExperience?.educationLevelExperiences || [];

  if (!eduExps.length) {
    errors.mandatoryExperience = "validation:experience_duration_required";
  } else {
    const isValid = eduExps.every(exp => {
      const hasDuration = exp.years || exp.months;
      const hasQualification = exp.educationLevel;

      // Qualification is mandatory
      if (!hasQualification) {
        return false;
      }

      // Duration is also mandatory
      return hasDuration;
    });

    if (!isValid) {
      errors.mandatoryExperience = "validation:qualification_and_duration_required";
    }
    
    // Description validation when toggle is ON (textarea is always visible)
    if (!formData.mandatoryExperience.description?.trim()) {
      errors.mandatoryExperience = "validation:experience_details_required";
    }
  }
}

// Preferred Experience validation
if (!formData.usePreferredEducationLevelExperience) {
  // OLD logic (toggle OFF)
 // validateExperience(formData.preferredExperience, "preferredExperience");
} else {
  // NEW logic (toggle ON)
  const eduExps = formData.preferredExperience?.educationLevelExperiences || [];

  if (!eduExps.length) {
    errors.preferredExperience = "validation:experience_duration_required";
  } else {
    // const isValid = eduExps.every(exp => {
    //   const hasDuration = exp.years || exp.months;
    //   const hasQualification = exp.educationLevel;

    //   // Qualification is mandatory
    //   if (!hasQualification) {
    //     return false;
    //   }

    //   // Duration is also mandatory
    //   return hasDuration;
    // });

    // if (!isValid) {
    //   errors.preferredExperience = "validation:qualification_and_duration_required";
    // }

    let hasQualificationError = false;
let hasDurationError = false;

eduExps.forEach(exp => {
  const isEmptyRow =
    !exp.educationLevel &&
    !exp.years &&
    !exp.months;

  if (isEmptyRow) return;

  if (!exp.educationLevel) {
    hasQualificationError = true;
  }

  if (!(exp.years || exp.months)) {
    hasDurationError = true;
  }
});

// 🎯 Decide message
if (hasQualificationError && hasDurationError) {
  errors.mandatoryExperience = "validation:qualification_and_duration_required";
} else if (hasQualificationError) {
  errors.mandatoryExperience = "validation:qualification_required";
} else if (hasDurationError) {
  errors.mandatoryExperience = "validation:experience_duration_required";
}
    
    // Description validation when toggle is ON (textarea is always visible)
    if (!formData.preferredExperience.description?.trim()) {
      errors.preferredExperience = "validation:experience_details_required";
    }
  }
}
  // if (
  //   formData.preferredExperience.years ||
  //   formData.preferredExperience.months ||
  //   formData.preferredExperience.description?.trim()
  // ) {
  //   validateExperience(formData.preferredExperience, "preferredExperience");
  // }
  // validateExperience(formData.preferredExperience, "preferredExperience");

  // ---------- RESPONSIBILITIES ----------
  formData.responsibilities = normalizeTitle(formData.responsibilities);

  if (!formData.responsibilities) {
    errors.responsibilities = "validation:required";
  }


  // ---------- STATE / NATIONAL DISTRIBUTION ----------

  if (formData.enableStateDistribution) {
    const activeStates = stateDistributions.filter(s => !s.__deleted);

    if (activeStates.length === 0) {
      errors.nationalDistribution = "validation:required";
    } else {
      const stateTotal = activeStates.reduce(
        (sum, s) => sum + Number(s.vacancies || 0),
        0
      );

      const vacancies = Number(formData.vacancies || 0);

      if (stateTotal !== vacancies) {
        errors.nationalDistribution = {
          key: "validation:state_total_mismatch",
          params: { stateTotal, vacancies }
        };
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
      errors.nationalDistribution = "validation:required";
    }
    else if (categoryTotal !== vacancies) {
      errors.nationalDistribution = {
        key: "validation:category_total_mismatch",
        params: { categoryTotal, vacancies }
      };
    }
    else if (disabilityTotal > categoryTotal) {
      errors.nationalDistribution = {
        key: "validation:disability_exceeds_category",
        params: { disabilityTotal, categoryTotal }
      };
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
    errors.state = "validation:required";
  }

  if (currentState.vacancies === "" || currentState.vacancies === null) {
    errors.stateVacancies = "validation:required";
  } else if (Number(currentState.vacancies) <= 0) {
    errors.stateVacancies = "validation:vacancies_must_be_greater_than_zero";
  }

  if (!currentState.language) {
    errors.stateLanguage = "validation:required";
  }

  const catTotal = Object.values(currentState.categories || {})
    .reduce((a, b) => a + Number(b || 0), 0);

  const disTotal = Object.values(currentState.disabilities || {})
    .reduce((a, b) => a + Number(b || 0), 0);

  const vacancies = Number(currentState.vacancies || 0);

  if (catTotal !== vacancies) {
    errors.stateDistribution = {
      key: "validation:category_total_mismatch",
      params: { categoryTotal: catTotal, vacancies }
    };

  }
  else if (disTotal > catTotal) {
    errors.stateDistribution = {
      key: "validation:disability_exceeds_category",
      params: { disabilityTotal: disTotal, categoryTotal: catTotal }
    };
  }


  const duplicate = stateDistributions.some(
    (s, i) =>
      String(s.state) === String(currentState.state) &&
      String(s.city || "") === String(currentState.city || "") &&
      !s.__deleted &&
      i !== editingIndex
  );

  if (duplicate) {
    errors.state = "validation:state_city_already_added";
  }


  return errors;
};
export const validateApprovedOn = (value) => {
  if (!value) return "validation:required"

  const selected = new Date(value);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selected > today) {
    return "validation:approved_date_future";
  }

  return "";
};

