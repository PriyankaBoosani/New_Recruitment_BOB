/* =========================
   API → UI (GET)
========================= */
export const mapPositionFromApi = (api) => ({
  id: api.positionId,
  title: api.positionName,
  description: api.positionDescription,

  // store UUIDs coming from backend
  departmentId: api.deptId,
  jobGradeId: api.jobGradeId,

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
export const mapPositionToApi = (ui, isEditing = false) => ({
  isActive: true,

  // 🔥 send positionId ONLY if editing
  ...(isEditing && { positionId: ui.id }),

  positionCode: ui.code || undefined,
  positionName: ui.title,
  positionDescription: ui.description,

  // 🔥 MUST be UUIDs
  deptId: ui.departmentId,
  jobGradeId: ui.jobGradeId
});
