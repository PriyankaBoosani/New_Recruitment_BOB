/**
 * UI state → jobPositionsDTO (pure JSON)
 */
export const mapPositionToDto = ({
  formData,
  educationData,
  approvedBy,
  approvedOn,
  requisitionId,
}) => {
  const mandatoryExperienceMonths =
    Number(formData.mandatoryExperience.years || 0) * 12 +
    Number(formData.mandatoryExperience.months || 0);

  const preferredExperienceMonths =
    Number(formData.preferredExperience.years || 0) * 12 +
    Number(formData.preferredExperience.months || 0);

  return {
    requisitionId,

    deptId: formData.department,
    positionId: formData.position,
    masterPositionId: formData.position,

    eligibilityAgeMin: Number(formData.minAge),
    eligibilityAgeMax: Number(formData.maxAge),

    employmentType: formData.employmentType || null,
    contractYears: Number(formData.contractualPeriod || 0),
    gradeId: formData.grade || null,

    totalVacancies: Number(formData.vacancies),

    isMedicalRequired: formData.medicalRequired === "yes",
    isLocationPreferenceEnabled: formData.enableLocation,
    isLocationWise: formData.enableStateDistribution,

    rolesResponsibilities: formData.responsibilities,

    /** 🔥 MANDATORY EDUCATION */
    mandatoryEducation: educationData.mandatory.text,
    mandatoryEduRulesJson: JSON.stringify({
      degrees: educationData.mandatory.rows,
      certifications: educationData.mandatory.certs,
    }),

    /** 🔥 PREFERRED EDUCATION */
    preferredEducation: educationData.preferred.text,
    preferredEduRulesJson: JSON.stringify({
      degrees: educationData.preferred.rows,
      certifications: educationData.preferred.certs,
    }),

    mandatoryExperienceMonths,
    preferredExperienceMonths,

    approvedBy,
    approvedOn,

    positionStatus: "DRAFT",
  };
};
