// utils/mapEduRulesToModalData.js
export function mapEduRulesToModalData(eduRulesJson) {
  if (!eduRulesJson) {
    return { educations: [], certificationIds: [] };
  }

  // Mandatory
  if (Array.isArray(eduRulesJson.mandatoryEducations)) {
    return {
      educations: eduRulesJson.mandatoryEducations.map(e => ({
        educationTypeId: e.educationTypeId,
        educationQualificationsId: e.educationQualificationsId,
        specializationId: e.specializationId
      })),
      certificationIds: eduRulesJson.mandatoryCertificationIds || []
    };
  }

  // Preferred
  if (Array.isArray(eduRulesJson.preferredEducations)) {
    return {
      educations: eduRulesJson.preferredEducations.map(e => ({
        educationTypeId: e.educationTypeId,
        educationQualificationsId: e.educationQualificationsId,
        specializationId: e.specializationId
      })),
      certificationIds: eduRulesJson.preferredCertificationIds || []
    };
  }

  return { educations: [], certificationIds: [] };
}

