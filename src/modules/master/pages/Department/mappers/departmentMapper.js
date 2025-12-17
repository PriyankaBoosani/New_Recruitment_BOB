// departmentMapper.js

// SINGLE item (API → UI)
export const mapDepartmentFromApi = (apiDept) => ({
  id: apiDept.department_id,
  name: apiDept.department_name,
  description: apiDept.department_desc,
   createdDate: apiDept.created_date
});

// LIST (API → UI)
export const mapDepartmentsFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapDepartmentFromApi);
};

// UI → API (Add / Update)
export const mapDepartmentToApi = (uiDept) => ({
  department_name: uiDept.name,
  department_desc: uiDept.description
});
