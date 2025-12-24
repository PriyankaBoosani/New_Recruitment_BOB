// src/modules/master/pages/JobGrade/mappers/jobGradeMapper.js

// ------------------------------
// API → UI
// ------------------------------
export const mapJobGradeFromApi = (api) => ({
  id: api.jobGradeId,
  scale: api.jobScale,
  gradeCode: api.jobGradeCode,
  minSalary: api.minSalary,
  maxSalary: api.maxSalary,
  description: api.jobGradeDesc,
  createdDate: api.createdDate
});

export const mapJobGradesFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapJobGradeFromApi);
};

// ------------------------------
// helpers
// ------------------------------
const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(String(value).replace(/,/g, ''));
};

const todayDate = () => new Date().toISOString().split('T')[0];

// ------------------------------
// UI → API (ADD / UPDATE)
// ------------------------------
export const mapJobGradeToApi = (ui, isEditing = false) => ({
  ...(isEditing && { jobGradeId: ui.id }),
  isActive: true,
  jobScale: ui.scale,
  jobGradeCode: ui.gradeCode,
  jobGradeDesc: ui.description,
  minSalary: parseNumber(ui.minSalary),
  maxSalary: parseNumber(ui.maxSalary),
  effectiveStateDate: todayDate(),
  effectiveEndDate: todayDate()
});
