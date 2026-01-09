export const mapAddPositionToCreateDto = ({
  formData,
  educationData,
  requisitionId,
  approvedBy,
  approvedOn
}) => {
  return {
    requisitionId,

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

    mandatoryEduRulesJson: JSON.stringify(educationData.mandatory),
    preferredEduRulesJson: JSON.stringify(educationData.preferred),

    totalExperience:
      Number(formData.mandatoryExperience.years || 0) * 12 +
      Number(formData.mandatoryExperience.months || 0),

    mandatoryExperienceMonths:
      Number(formData.mandatoryExperience.months || 0),

    preferredExperienceMonths:
      Number(formData.preferredExperience.months || 0),

    rolesResponsibilities: formData.responsibilities,

    isMedicalRequired: formData.medicalRequired === "yes",

    approvedBy,
    approvedOn,

    positionStatus: "Draft",

    // 🚨 leave empty for now (next iteration)
    positionRequiredDocuments: [],
    positionStateDistributions: [],
    positionCategoryNationalDistributions: []
  };
};
