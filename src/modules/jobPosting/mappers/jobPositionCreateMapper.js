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
        ? { 
            mandatoryEducations: { operator: "OR", groups: [] },
            mandatoryCertifications: { operator: "OR", groups: [] }
          }
        : { 
            preferredEducations: { operator: "OR", groups: [] },
            preferredCertifications: { operator: "OR", groups: [] }
          };
    }

    // Process education groups with OR/AND operators
    const educationGroups = [];
    if (edu.groups && Array.isArray(edu.groups)) {
      edu.groups.forEach(group => {
        const conditions = [];
        
        if (group.educations && Array.isArray(group.educations)) {
          group.educations.forEach(edu => {
            if (edu.educationTypeId && edu.educationQualificationsId) {
              conditions.push({
                educationType: edu.educationTypeId,
                qualification: edu.educationQualificationsId,
                specialization: edu.specializationId || "",
                duration: edu.duration || "",
                gpa: edu.gpa || "",
                percentage: edu.percentage || ""
              });
            }
          });
        }

        if (conditions.length > 0) {
          educationGroups.push({
            operator: "AND",
            conditions: conditions
          });
        }
      });
    }

    // Process certification groups with OR/AND operators
    const certificationGroups = [];
    if (edu.certGroups && Array.isArray(edu.certGroups)) {
      edu.certGroups.forEach(certGroup => {
        const conditions = [];
        
        if (certGroup.certifications && Array.isArray(certGroup.certifications)) {
          certGroup.certifications.forEach(cert => {
            if (cert.certificationId) {
              conditions.push(cert.certificationId);
            }
          });
        }

        if (conditions.length > 0) {
          certificationGroups.push({
            operator: "AND",
            conditions: conditions
          });
        }
      });
    }

    return mode === "mandatory"
      ? {
          mandatoryEducations: {
            operator: "OR",
            groups: educationGroups
          },
          mandatoryCertificationIds: {
            operator: "OR",
            groups: certificationGroups
          }
        }
      : {
          preferredEducations: {
            operator: "OR",
            groups: educationGroups
          },
          preferredCertifications: {
            operator: "OR",
            groups: certificationGroups
          }
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


    isMandatoryExpMonthsEduWise: !!formData.useMandatoryEducationLevelExperience,
    isPreferredExpMonthsEduWise: !!formData.usePreferredEducationLevelExperience,

    // Map education level experiences when toggles are ON
    mandatoryEducationLevelExperiences: formData.useMandatoryEducationLevelExperience 
      ? (formData.mandatoryExperience?.educationLevelExperiences || []).reduce((acc, exp) => {
          if (exp.educationLevel && (exp.years || exp.months)) {
            acc[exp.educationLevel] = (Number(exp.years || 0) * 12) + Number(exp.months || 0);
          }
          return acc;
        }, {})
      : {},

    preferredEducationLevelExperiences: formData.usePreferredEducationLevelExperience 
      ? (formData.preferredExperience?.educationLevelExperiences || []).reduce((acc, exp) => {
          if (exp.educationLevel && (exp.years || exp.months)) {
            acc[exp.educationLevel] = (Number(exp.years || 0) * 12) + Number(exp.months || 0);
          }
          return acc;
        }, {})
      : {},

    mandatoryExperienceMonths:
      !formData.useMandatoryEducationLevelExperience
        ? Number(formData.mandatoryExperience.years || 0) * 12 +
          Number(formData.mandatoryExperience.months || 0)
        : 0,

    preferredExperienceMonths:
      !formData.usePreferredEducationLevelExperience
        ? Number(formData.preferredExperience.years || 0) * 12 +
          Number(formData.preferredExperience.months || 0)
        : 0,

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
