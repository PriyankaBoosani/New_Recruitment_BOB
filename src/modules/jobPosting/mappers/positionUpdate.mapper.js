export const mapAddPositionToUpdateDto = ({
  positionId,
  requisitionId,
  formData,
  educationData,
  stateDistributions,
  nationalCategories,
  nationalDisabilities,
  reservationCategories,
  disabilityCategories,
  qualifications,
  certifications,
  approvedBy,
  approvedOn,
  existingPosition
}) => {
  const dto = {
    positionId,
    requisitionId,
    deptId: formData.department,
    masterPositionId: formData.position,
    totalVacancies: Number(formData.vacancies),
    eligibilityAgeMin: Number(formData.minAge),
    eligibilityAgeMax: Number(formData.maxAge),
    employmentType: formData.employmentType,
    contractYears: Number(formData.contractualPeriod),
    gradeId: formData.grade,
    isLocationPreferenceEnabled: formData.enableLocation,
    isLocationWise: formData.enableStateDistribution,
    rolesResponsibilities: formData.responsibilities,
    isMedicalRequired: formData.medicalRequired === "yes",

    mandatoryEducation: educationData.mandatory.text,
    preferredEducation: educationData.preferred.text,

    mandatoryExperienceMonths:
      Number(formData.mandatoryExperience.years) * 12 +
      Number(formData.mandatoryExperience.months),

    preferredExperienceMonths:
      Number(formData.preferredExperience.years) * 12 +
      Number(formData.preferredExperience.months),

    mandatoryExperience: formData.mandatoryExperience.description,
    preferredExperience: formData.preferredExperience.description,

    approvedBy,
    approvedOn,

    qualificationIds: qualifications.map(q => q.id),
    certificationIds: certifications.map(c => c.id),

    // IMPORTANT
    positionCategoryNationalDistributions: [],
    positionStateDistributions: []
  };

  // NATIONAL
  if (!formData.enableStateDistribution) {
    reservationCategories.forEach(cat => {
      dto.positionCategoryNationalDistributions.push({
        reservationCategoryId: cat.id,
        vacancyCount: Number(nationalCategories[cat.code] || 0),
        isDisability: false
      });
    });

    disabilityCategories.forEach(dis => {
      dto.positionCategoryNationalDistributions.push({
        disabilityCategoryId: dis.id,
        vacancyCount: Number(nationalDisabilities[dis.disabilityCode] || 0),
        isDisability: true
      });
    });
  }

  // STATE
  if (formData.enableStateDistribution) {
    dto.positionStateDistributions = stateDistributions.map(sd => ({
      stateId: sd.state,
      totalVacancies: Number(sd.vacancies),
      localLanguage: sd.language,
      positionCategoryDistributions: [
        ...reservationCategories.map(cat => ({
          reservationCategoryId: cat.id,
          vacancyCount: Number(sd.categories?.[cat.code] || 0),
          isDisability: false
        })),
        ...disabilityCategories.map(dis => ({
          disabilityCategoryId: dis.id,
          vacancyCount: Number(sd.disabilities?.[dis.disabilityCode] || 0),
          isDisability: true
        }))
      ]
    }));
  }

  return dto;
};
