// utils/mapEduRulesToModalData.js
export function mapEduRulesToModalData(
  rulesJson,
  educationTypes,
  qualifications,
  specializations,
  certifications
) {
  if (!rulesJson?.rules?.length) {
    return { educations: [], certificationIds: [], text: "" };
  }

  const rule = rulesJson.rules[0];

  /* ================= NEW FORMAT (preferred) ================= */
  if (Array.isArray(rule.educations) && rule.educations.length > 0) {
    return {
      educations: rule.educations.map(e => ({
        educationTypeId: e.educationTypeId,
        educationQualificationsId: e.educationQualificationId,
        specializationId: e.specializationId
      })),
      certificationIds: (rule.certifications || [])
        .map(name => certifications.find(c => c.name === name)?.id)
        .filter(Boolean),
      text: "" // text comes separately
    };
  }

  /* ================= LEGACY FORMAT (fallback) ================= */
  // old records that only had degrees[]
  const educations = (rule.degrees || [])
    .map(degName => {
      const qualification = qualifications.find(q => q.name === degName);
      if (!qualification) return null;

      return {
        educationTypeId: "", // cannot infer
        educationQualificationsId: qualification.id,
        specializationId: "" // cannot infer
      };
    })
    .filter(Boolean);

  return {
    educations,
    certificationIds: (rule.certifications || [])
      .map(name => certifications.find(c => c.name === name)?.id)
      .filter(Boolean),
    text: ""
  };
}
