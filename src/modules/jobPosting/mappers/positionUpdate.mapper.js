const buildCategoryDistributionsForUpdate = (
  sd,
  reservationCategories,
  disabilityCategories
) => {
  const result = [];

  // 1️⃣ Existing backend categories → UPDATE
  sd.categoryDistributions?.forEach(existing => {
    let newCount = 0;

    if (!existing.isDisability) {
      const cat = reservationCategories.find(
        c => c.id === existing.reservationCategoryId
      );
      newCount = Number(sd.categories?.[cat?.code] || 0);
    } else {
      const dis = disabilityCategories.find(
        d => d.id === existing.disabilityCategoryId
      );
      newCount = Number(sd.disabilities?.[dis?.disabilityCode] || 0);
    }

    if (newCount > 0) {
      result.push({
        positionCategoryDistributionId:
          existing.positionCategoryDistributionId, // 🔑 KEEP ID
        reservationCategoryId: existing.reservationCategoryId,
        disabilityCategoryId: existing.disabilityCategoryId,
        vacancyCount: newCount,
        isDisability: existing.isDisability
      });
    }
    // newCount === 0 → removed → don't send
  });

  // 2️⃣ Newly added categories → CREATE
  reservationCategories.forEach(cat => {
    const alreadyExists = sd.categoryDistributions?.some(
      x => x.reservationCategoryId === cat.id && !x.isDisability
    );
    if (!alreadyExists) {
      const count = Number(sd.categories?.[cat.code] || 0);
      if (count > 0) {
        result.push({
          positionCategoryDistributionId: null,
          reservationCategoryId: cat.id,
          vacancyCount: count,
          isDisability: false
        });
      }
    }
  });

  disabilityCategories.forEach(dis => {
    const alreadyExists = sd.categoryDistributions?.some(
      x => x.disabilityCategoryId === dis.id && x.isDisability
    );
    if (!alreadyExists) {
      const count = Number(sd.disabilities?.[dis.disabilityCode] || 0);
      if (count > 0) {
        result.push({
          positionCategoryDistributionId: null,
          disabilityCategoryId: dis.id,
          vacancyCount: count,
          isDisability: true
        });
      }
    }
  });

  return result;
};

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
  positionStateDistributionId: sd.positionStateDistributionId, // 🔑 MISSING TODAY
  stateId: sd.state,
  totalVacancies: Number(sd.vacancies),
  localLanguage: sd.language,
  positionCategoryDistributions: buildCategoryDistributionsForUpdate(
    sd,
    reservationCategories,
    disabilityCategories
  )
}));



  }




  return dto;
};
