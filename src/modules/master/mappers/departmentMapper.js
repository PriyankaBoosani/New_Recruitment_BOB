// UI expects: { id, name, description }

// API → UI
export const mapDepartmentFromApi = (apiDept) => ({
  id: apiDept.department_id,
  name: apiDept.department_name,
  description: apiDept.department_desc
});

// UI → API (for add / update)
export const mapDepartmentToApi = (uiDept) => ({
  department_name: uiDept.name,
  department_desc: uiDept.description
});
