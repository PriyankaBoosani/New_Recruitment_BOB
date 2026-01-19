export const mapAddPositionToCreateDto = ({
  formData,
  educationData,
  requisitionId,
  approvedBy,
  approvedOn,

  currentState,
  stateDistributions = [],
  reservationCategories = [],
  disabilityCategories = [],
  nationalCategories = {},
  nationalDisabilities = {},

  qualifications = [],
  certifications = [],
}) => {
  /* ================= SAFE NORMALIZATION ================= */
  const safeQualifications = Array.isArray(qualifications) ? qualifications : [];
  const safeCertifications = Array.isArray(certifications) ? certifications : [];
  const buildEducationRules = (edu) => {
  if (!edu || !Array.isArray(edu.educations) || edu.educations.length === 0) {
    return [];
  }

  // legacy — backend expects this
  const degrees = edu.educations
    .map(e =>
      safeQualifications.find(q => q.id === e.educationQualificationsId)?.name
    )
    .filter(Boolean);

  const certNames = (edu.certificationIds || [])
    .map(id => safeCertifications.find(c => c.id === id)?.name)
    .filter(Boolean);

  if (degrees.length === 0) {
    throw new Error("Education rules must contain at least one degree name");
  }

  return [
    {
      operator: "OR",

      //  BACKEND (unchanged)
      degrees,
      ...(certNames.length ? { certifications: certNames } : {}),

      //  FRONTEND (new, structured, lossless)
      educations: edu.educations.map(e => ({
        educationTypeId: e.educationTypeId,
        educationQualificationId: e.educationQualificationsId,
        specializationId: e.specializationId
      }))
    }
  ];
};


  /* ================= NATIONAL TOTAL VALIDATION ================= */
  // if (!formData.enableStateDistribution) {
  //   const categoryTotal = Object.values(nationalCategories)
  //     .reduce((a, b) => a + Number(b || 0), 0);

  //   const disabilityTotal = Object.values(nationalDisabilities)
  //     .reduce((a, b) => a + Number(b || 0), 0);

  //   const total = categoryTotal + disabilityTotal;

  //   if (total !== Number(formData.vacancies)) {
  //     throw new Error(
  //       `National distribution total (${total}) must equal total vacancies (${formData.vacancies})`
  //     );
  //   }
  // }

  /* ================= FINAL DTO ================= */
  return {
    requisitionId,
    //  DO NOT SEND positionId ON CREATE
    deptId: formData.department,
    masterPositionId: formData.position,

    totalVacancies: Number(formData.vacancies),
    eligibilityAgeMin: Number(formData.minAge),
    eligibilityAgeMax: Number(formData.maxAge),

    employmentType: formData.employmentType,
    gradeId: formData.grade,

    contractYears: Number(formData.contractualPeriod || 0),

    isLocationPreferenceEnabled: !!formData.enableLocation,
    isLocationWise: !!formData.enableStateDistribution,

    mandatoryEducation: educationData.mandatory.text,
    preferredEducation: educationData.preferred.text,

    //  OBJECT — NOT STRING
    mandatoryEduRulesJson: {
      rules: buildEducationRules(educationData.mandatory),
    },
    preferredEduRulesJson: {
      rules: buildEducationRules(educationData.preferred),
    },

    mandatoryExperienceMonths:
      Number(formData.mandatoryExperience.years || 0) * 12 +
      Number(formData.mandatoryExperience.months || 0),

    preferredExperienceMonths:
      Number(formData.preferredExperience.years || 0) * 12 +
      Number(formData.preferredExperience.months || 0),

    mandatoryExperience: formData.mandatoryExperience.description || "",
    preferredExperience: formData.preferredExperience.description || "",

    rolesResponsibilities: formData.responsibilities,

    isMedicalRequired: formData.medicalRequired === "yes",

    approvedBy,
    approvedOn,

    // backend expects this
    cibilScore: 0,

    positionStatus: "Draft",

    positionRequiredDocuments: [],

    /* ================= STATE WISE ================= */
    positionStateDistributions: formData.enableStateDistribution
      ? stateDistributions.map(state =>
        mapStateDistribution({
          currentState: state,
          reservationCategories,
          disabilityCategories,
        })
      )
      : [],


    /* ================= NATIONAL WISE ================= */
    positionCategoryNationalDistributions: !formData.enableStateDistribution
      ? mapNationalCategoryDistribution({
        nationalCategories,
        nationalDisabilities,
        reservationCategories,
        disabilityCategories,
      })
      : [],
  };
};

/* ================= STATE DISTRIBUTION ================= */

const mapStateDistribution = ({
  currentState,
  reservationCategories,
  disabilityCategories,
}) => {
  const distributions = [];

  reservationCategories.forEach(cat => {
    const count = Number(currentState.categories?.[cat.code] || 0);
    if (count > 0) {
      distributions.push({
        reservationCategoryId: cat.id,
        disabilityCategoryId: null,
        vacancyCount: count,
        isDisability: false,
      });
    }
  });

  disabilityCategories.forEach(dis => {
    const count = Number(currentState.disabilities?.[dis.disabilityCode] || 0);
    if (count > 0) {
      distributions.push({
        reservationCategoryId: null,
        disabilityCategoryId: dis.id,
        vacancyCount: count,
        isDisability: true,
      });
    }
  });

  return {
    stateId: currentState.state,
    totalVacancies: Number(currentState.vacancies),
    localLanguage: currentState.language,
    positionCategoryDistributions: distributions,
  };
};

/* ================= NATIONAL DISTRIBUTION ================= */

const mapNationalCategoryDistribution = ({
  nationalCategories,
  nationalDisabilities,
  reservationCategories,
  disabilityCategories,
}) => {
  const distributions = [];

  reservationCategories.forEach(cat => {
    const count = Number(nationalCategories[cat.code] || 0);
    if (count > 0) {
      distributions.push({
        reservationCategoryId: cat.id,
        disabilityCategoryId: null,
        vacancyCount: count,
        isDisability: false,
      });
    }
  });

  disabilityCategories.forEach(dis => {
    const count = Number(nationalDisabilities[dis.disabilityCode] || 0);
    if (count > 0) {
      distributions.push({
        reservationCategoryId: null,
        disabilityCategoryId: dis.id,
        vacancyCount: count,
        isDisability: true,
      });
    }
  });

  return distributions;
};
