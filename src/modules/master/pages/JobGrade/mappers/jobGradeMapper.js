// src/modules/master/pages/JobGrade/mappers/jobGradeMapper.js

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

export const mapJobGradeToApi = (ui) => ({
  jobScale: ui.scale,
  jobGradeCode: ui.gradeCode,
  minSalary: ui.minSalary,
  maxSalary: ui.maxSalary,
  jobGradeDesc: ui.description
});



// {
//   "isActive": true,
//   "jobGradeCode": "string",
//   "jobGradeDesc": "string",
//   "jobScale": "string",
//   "minSalary": 0,
//   "maxSalary": 0,
//   "effectiveStateDate": "2025-12-19",
//   "effectiveEndDate": "2025-12-19",
//   "jobGradeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
// }