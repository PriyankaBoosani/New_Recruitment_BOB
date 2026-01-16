export function buildEducationText(
  educations,
  certificationIds,
  educationTypes,
  qualifications,
  specializations,
  certifications
) {
  const getLabel = (list, id, key = "label") =>
    list.find(i => i.id === id)?.[key] || "";

  const degreeText = educations
    .map((r, i) => {
      const type = getLabel(educationTypes, r.educationTypeId);
      const degree = getLabel(qualifications, r.educationQualificationsId, "name");
      const spec = getLabel(specializations, r.specializationId);

      if (!type || !degree || !spec) return null;

      return `${i > 0 ? "OR " : ""}${type} ${degree} in ${spec}`;
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
