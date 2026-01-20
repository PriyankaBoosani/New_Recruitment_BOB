export function buildEducationText(
  educations = [],
  certificationIds = [],
  educationTypes = [],
  qualifications = [],
  specializations = [],
  certifications = []
) {
  const degreeText = educations
    .map((r, i) => {
      const type = educationTypes.find(
        t => t.id === r.educationTypeId
      )?.name;

      const degree = qualifications.find(
        q => q.id === r.educationQualificationsId
      )?.name;

      const spec = specializations.find(
        s => s.id === r.specializationId
      )?.label; // OPTIONAL

      // 🔴 ONLY THESE TWO ARE REQUIRED
      if (!type || !degree) return null;

      return `${i > 0 ? "OR " : ""}${type} ${degree}${
        spec ? ` in ${spec}` : ""
      }`;
    })
    .filter(Boolean)
    .join(" ");

  const certText = certificationIds
    .map(id => certifications.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(" OR ");

  return `Degree Requirements:
${degreeText || "Not specified"}
Certifications: ${certText || "None"}`;
}
