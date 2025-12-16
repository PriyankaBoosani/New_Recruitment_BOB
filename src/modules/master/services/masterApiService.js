// src/services/masterApiService.js
import { apis, nodeApi } from "../../../core/service/apiService"; // reuse axios instances + interceptors

const masterApiService = {
  /* Users (Node API) */
  // Note: auth header is injected by nodeApi interceptor; no need to pass token manually
  getRegister: () => nodeApi.get('/getdetails/users/all'),
  registerUser: (data) => nodeApi.post('/recruiter-auth/recruiter-register', data),

  // city
  getallCities: () => apis.get('/city/all'),
  /* Locations */
  getAllLocations: () => apis.get("/location/all"),
  addLocation: (data) => apis.post("/location/add", data),
  updateLocation: (id, data) => apis.put(`/location/update/${id}`, data),
  deleteLocation: (id) => apis.delete(`/location/delete/${id}`),

  /* Departments */
  getAllDepartments: () => apis.get("/departments/all"),
  addDepartment: (data) => apis.post("/departments/add", data),
  updateDepartment: (id, data) => apis.put(`/departments/update/${id}`, data),
  deleteDepartment: (id) => apis.delete(`/departments/delete/${id}`),

  /* Skills */
  getAllSkills: () => apis.get("/skill/all"),
  addSkill: (data) => apis.post("/skill/add", data),
  updateSkill: (id, data) => apis.put(`/skill/update/${id}`, data),
  deleteSkill: (id) => apis.delete(`/skill/delete/${id}`),

  /* Categories */
  getAllCategories: () => apis.get("/categories/all"),
  addCategory: (data) => apis.post("/categories/add", data),
  updateCategory: (id, data) => apis.put(`/categories/update/${id}`, data),
  deleteCategory: (id) => apis.delete(`/categories/delete/${id}`),

  /* Special Categories */
  getAllSpecialCategories: () => apis.get("/special-categories/all"),
  addSpecialCategory: (data) => apis.post("/special-categories/add", data),
  updateSpecialCategory: (id, data) => apis.put(`/special-categories/update/${id}`, data),
  deleteSpecialCategory: (id) => apis.delete(`/special-categories/delete/${id}`),

  /* Job Grades */
  getAllJobGrades: () => apis.get("/jobgrade/all"),
  addJobGrade: (data) => apis.post("/jobgrade/add", data),
  updateJobGrade: (id, data) => apis.put(`/jobgrade/update/${id}`, data),
  deleteJobGrade: (id) => apis.delete(`/jobgrade/delete/${id}`),

  /* Master positions */
  getAllPositions: () => apis.get("/master-positions/all"),
  addPosition: (data) => apis.post("/master-positions/add", data),
  updatePosition: (id, data) => apis.put(`/master-positions/update/${id}`, data),
  deletePosition: (id) => apis.delete(`/master-positions/delete/${id}`),

  /* Document Types */
  getAllDocumentTypes: () => apis.get("/document-types/all"),
  addDocumentType: (data) => apis.post("/document-types/add", data),
  updateDocumentType: (id, data) => apis.put(`/document-types/update/${id}`, data),
  deleteDocumentType: (id) => apis.delete(`/document-types/delete/${id}`),

  /* Relaxation Types */
  getAllRelaxationTypes: () => apis.get("/relaxation-type/all"),
  addRelaxationType: (data) => apis.post("/relaxation-type/add", data),
  updateRelaxationType: (id, data) => apis.put(`/relaxation-type/update/${id}`, data),
  deleteRelaxationType: (id) => apis.delete(`/relaxation-type/delete/${id}`),

  /* Interview Panels */
  getInterviewPanels: () => apis.get("/interview-panels/all"),
  addInterviewPanel: (data) => apis.post("/interview-panels/add", data),
  updateInterviewPanel: (id, data) => apis.put(`/interview-panels/update/${id}`, data),
  deleteInterviewPanel: (id) => apis.delete(`/interview-panels/delete/${id}`),

  /* Optional master all */
  getMasterAll: () => apis.get("/all"),
};

export default masterApiService;
