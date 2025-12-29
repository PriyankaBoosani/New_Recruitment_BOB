/* =========================
   API → UI (GET)
========================= */
export const mapPositionFromApi = (api) => ({
  id: api.masterPositionsId || api.positionId,

  title: api.positionName,
  description: api.positionDescription,

  departmentId: api.deptId,
  jobGradeId: api.gradeId,

  mandatoryEducation: api.mandatoryEducation || "",
  preferredEducation: api.preferredEducation || "",
  mandatoryExperience: api.mandatoryExperience || "",
  preferredExperience: api.preferredExperience || "",
  rolesResponsibilities: api.rolesResponsibilities || "",
  eligibilityAgeMin: api.eligibilityAgeMin ||  "",
  eligibilityAgeMax: api.eligibilityAgeMax ||  "",

  code: api.positionCode,
  isActive: api.isActive
});

/* =========================
   LIST
========================= */
export const mapPositionsFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapPositionFromApi);
};

/* =========================
   UI → API (ADD / UPDATE)
========================= */
/* =========================
   UI → API (ADD / UPDATE)
========================= */
export const mapPositionToApi = (ui, isEditing = false) => ({
  isActive: true,

  ...(isEditing && { masterPositionsId: ui.id }),

  positionCode: ui.code || undefined,
  positionName: ui.title,
  positionDescription: ui.description || "",

  // 🔥 REQUIRED UUIDs
  deptId: ui.departmentId,
  gradeId: ui.jobGradeId,

  // 🔥 NEW FIELDS (YOU MISSED THESE)
  mandatoryEducation: ui.mandatoryEducation,
  preferredEducation: ui.preferredEducation,
  mandatoryExperience: ui.mandatoryExperience,
  preferredExperience: ui.preferredExperience,
  rolesResponsibilities: ui.rolesResponsibilities,
  eligibilityAgeMin: ui.eligibilityAgeMin,
  eligibilityAgeMax: ui.eligibilityAgeMax
});
