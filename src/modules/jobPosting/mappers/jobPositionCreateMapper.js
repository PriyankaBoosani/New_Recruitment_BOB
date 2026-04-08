export const mapAddPositionToCreateDto = ({
  formData,
  educationData,
  requisitionId,
  approvedBy,
  approvedOn,
  indentName,
  indentOthers,
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

  const buildEduRulesJson = (edu, mode) => {
    if (!edu) {
      return mode === "mandatory"
        ? { mandatoryEducations: [], mandatoryCertificationIds: [] }
        : { preferredEducations: [], preferredCertificationIds: [] };
    }

    // Handle new structure with groups and certGroups from EducationModal
    const educations = [];
    const certificationIds = [];

    // Extract educations from groups
    if (edu.groups && Array.isArray(edu.groups)) {
      edu.groups.forEach(group => {
        if (group.educations && Array.isArray(group.educations)) {
          group.educations.forEach(edu => {
            if (edu.educationTypeId && edu.educationQualificationsId) {
              educations.push({
                educationTypeId: edu.educationTypeId,
                educationQualificationsId: edu.educationQualificationsId,
                specializationId: edu.specializationId,
                duration: edu.duration,
                gpa: edu.gpa,
                percentage: edu.percentage
              });
            }
          });
        }
      });
    }

    // Extract certifications from certGroups
    if (edu.certGroups && Array.isArray(edu.certGroups)) {
      edu.certGroups.forEach(certGroup => {
        if (certGroup.certifications && Array.isArray(certGroup.certifications)) {
          certGroup.certifications.forEach(cert => {
            if (cert.certificationId) {
              certificationIds.push(cert.certificationId);
            }
          });
        }
      });
    }

    return mode === "mandatory"
      ? {
        mandatoryEducations: educations,
        mandatoryCertificationIds: certificationIds,
      }
      : {
        preferredEducations: educations,
        preferredCertificationIds: certificationIds,
      };
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
    indentName: formData.indentName,

    contractYears: Number(formData.contractualPeriod || 0),

    isLocationPreferenceEnabled: !!formData.enableLocation,
    isLocationWise: !!formData.enableStateDistribution,

    mandatoryEducation: educationData.mandatory.text,
    preferredEducation: educationData.preferred.text,

    //  OBJECT — NOT STRING
    mandatoryEduRulesJson: buildEduRulesJson(
      educationData.mandatory,
      "mandatory"
    ),

    preferredEduRulesJson: buildEduRulesJson(
      educationData.preferred,
      "preferred"
    ),


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
    indentOthers: indentOthers?.trim() || null,

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
    cityId: currentState.city,
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
