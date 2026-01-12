// src/modules/jobPosting/mappers/positionPayload.mapper.js

export const mapAddPositionToCreateDto = ({
  formData,
  educationData,
  requisitionId,
  approvedBy,
  approvedOn,

  currentState,
  reservationCategories,
  disabilityCategories,
  nationalCategories,
  nationalDisabilities,

  qualifications,
  certifications,
}) => {

  /* ---------------- EDUCATION RULE BUILDER ---------------- */
  const buildEducationRules = (edu) => {
    if (!edu?.educations?.length) return [];

    return [
      {
        operator: "OR",

        // 🔥 BACKEND EXPECTS NAMES, NOT IDS
        degrees: edu.educations
          .map(e =>
            qualifications.find(q => q.id === e.educationQualificationsId)?.name
          )
          .filter(Boolean),

        certifications: (edu.certificationIds || [])
          .map(id =>
            certifications.find(c => c.id === id)?.name
          )
          .filter(Boolean),
      },
    ];
  };

  /* ---------------- NATIONAL TOTAL VALIDATION ---------------- */
  if (!formData.enableStateDistribution) {
    const categoryTotal = Object.values(nationalCategories || {})
      .reduce((a, b) => a + Number(b || 0), 0);

    const disabilityTotal = Object.values(nationalDisabilities || {})
      .reduce((a, b) => a + Number(b || 0), 0);

    const total = categoryTotal + disabilityTotal;

    if (total !== Number(formData.vacancies)) {
      throw new Error(
        `National distribution total (${total}) must equal total vacancies (${formData.vacancies})`
      );
    }
  }

  /* ---------------- FINAL DTO ---------------- */
  return {
    requisitionId,

    // 🔑 REQUIRED IDS
    deptId: formData.department,
    positionId: formData.position,
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

    // ✅ EXACT STRUCTURE BACKEND EXPECTS
    mandatoryEduRulesJson: JSON.stringify({
      rules: buildEducationRules(educationData.mandatory),
    }),
    preferredEduRulesJson: JSON.stringify({
      rules: buildEducationRules(educationData.preferred),
    }),

    // ✅ TOTAL MONTHS (NOT JUST REMAINDER)
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

    // 🔥 SAFE DEFAULT
    cibilScore: 0,

    positionStatus: "Draft",

    positionRequiredDocuments: [],

    /* ---------------- STATE-WISE ---------------- */
    positionStateDistributions: formData.enableStateDistribution
      ? [
          mapStateDistribution({
            currentState,
            reservationCategories,
            disabilityCategories,
            positionId: formData.position,
          }),
        ]
      : [],

    /* ---------------- NATIONAL-WISE ---------------- */
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
  positionId,
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
    positionId,
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
