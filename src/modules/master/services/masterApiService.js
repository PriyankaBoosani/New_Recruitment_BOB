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
  // DOWNLOAD LOCATION TEMPLATE
  downloadLocationTemplate: () =>
    apis.get("/location/download-template", {
      responseType: "blob",
    }),

  //  BULK ADD LOCATIONS
  bulkAddLocations: (file) => {
    const formData = new FormData();

    //  backend expects "attachment"
    formData.append("file", file);

    return apis.post("/location/bulk-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /* Departments */
  getAllDepartments: () => apis.get("/departments/all"),
  addDepartment: (data) => apis.post("/departments/add", data),
  updateDepartment: (id, data) => apis.put(`/departments/update/${id}`, data),
  deleteDepartment: (id) => apis.delete(`/departments/delete/${id}`),
  downloadDepartmentTemplate: () => apis.get("/departments/download-template", { responseType: 'blob' }),
  bulkAddDepartments: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apis.post('/departments/bulk-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /* Skills */
  getAllSkills: () => apis.get("/skill/all"),
  addSkill: (data) => apis.post("/skill/add", data),
  updateSkill: (id, data) => apis.put(`/skill/update/${id}`, data),
  deleteSkill: (id) => apis.delete(`/skill/delete/${id}`),

  /* Categories */
  getAllCategories: () => apis.get("/reservation-categories/all"),
  addCategory: (data) => apis.post("/reservation-categories/add", data),
  updateCategory: (id, data) => apis.put(`/reservation-categories/update/${id}`, data),
  deleteCategory: (id) => apis.delete(`/reservation-categories/delete/${id}`),
  downloadCategoryTemplate: () => apis.get("/reservation-categories/download-template", { responseType: "blob", }),
  bulkAddCategories: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apis.post("/reservation-categories/bulk-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /* Special Categories */
  getAllSpecialCategories: () => apis.get("/special-categories/all"),
  addSpecialCategory: (data) => apis.post("/special-categories/add", data),
  updateSpecialCategory: (id, data) => apis.put(`/special-categories/update/${id}`, data),
  deleteSpecialCategory: (id) => apis.delete(`/special-categories/delete/${id}`),
  //  DOWNLOAD SPECIAL CATEGORY TEMPLATE
  downloadSpecialCategoryTemplate: () =>
    apis.get("/special-categories/download-template", {
      responseType: "blob",
    }),

  //  BULK ADD SPECIAL CATEGORIES
  bulkAddSpecialCategories: (file) => {
    const formData = new FormData();
    formData.append("file", file);


    return apis.post("/special-categories/bulk-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },


  /* Job Grades */
  getAllJobGrades: () => apis.get("/jobgrade/all"),
  addJobGrade: (data) => apis.post("/jobgrade/add", data),
  updateJobGrade: (id, data) => apis.put(`/jobgrade/update/${id}`, data),
  deleteJobGrade: (id) => apis.delete(`/jobgrade/delete/${id}`),
  //  DOWNLOAD JOB GRADE TEMPLATE
  downloadJobGradeTemplate: () =>
    apis.get("/jobgrade/download-template", {
      responseType: "blob",
    }),

  //  BULK ADD JOB GRADES
  bulkAddJobGrades: (file) => {
    const formData = new FormData();

    formData.append("file", file);

    return apis.post("/jobgrade/bulk-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /* certification-master-controller */
  getAllCertificates: () => apis.get("/certificates-master/all"),
  addCertificates: (data) => apis.post("/certificates-master/add", data),
  updateCertificates: (id, data) => apis.put(`/certificates-master/update/${id}`, data),
  deleteCertificates: (id) => apis.delete(`/certificates-master/delete/${id}`),
   //  DOWNLOAD JOB GRADE TEMPLATE
  downloadCertificatesTemplate: () =>
    apis.get("/certificates-master/download-template", {
      responseType: "blob",
    }),

   bulkAddCertificates: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apis.post('/certificates-master/bulk-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /* Master positions */
  getAllPositions: () => apis.get("/master-positions/all"),
  addPosition: (data) => apis.post("/master-positions/add", data),
  updatePosition: (id, data) => apis.put(`/master-positions/update/${id}`, data),
  deletePosition: (id) => apis.delete(`/master-positions/delete/${id}`),
  downloadPositionTemplate: () => apis.get("/master-positions/download-template", { responseType: 'blob' }),


  bulkAddPositions: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apis.post('/master-positions/bulk-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /* Document Types */
  getAllDocumentTypes: () => apis.get("/document-types/all"),
  addDocumentType: (data) => apis.post("/document-types/add", data),
  updateDocumentType: (id, data) => apis.put(`/document-types/update/${id}`, data),
  deleteDocumentType: (id) => apis.delete(`/document-types/delete/${id}`),
  downloadDocumentTemplate: () => apis.get("/document-types/download-template", { responseType: "blob", }),
  bulkAddDocuments: (file) => {
    const formData = new FormData();

    // 🔥 backend expects "attachment"
    formData.append("file", file);

    return apis.post("/document-types/bulk-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  /* Relaxation Types */
  getAllRelaxationTypes: () => apis.get("/relaxation-type/all"),
  addRelaxationType: (data) => apis.post("/relaxation-type/add", data),
  updateRelaxationType: (id, data) => apis.put(`/relaxation-type/update/${id}`, data),
  deleteRelaxationType: (id) => apis.delete(`/relaxation-type/delete/${id}`),

  /* Interview Panels */
  getInterviewPanels: () => apis.get("/interview-panels/get-all"),
  addInterviewPanel: (data) => apis.post("/interview-panels/add", data),
  updateInterviewPanel: (id, data) => apis.put(`/interview-panels/update/${id}`, data),
  deleteInterviewPanel: (id) => apis.delete(`/interview-panels/delete/${id}`),
  getActiveInterviewMembers: () => apis.get("/interview-panels/active-members"),
  getInterviewPanelById: (id) => apis.get(`/interview-panels/get-by-id/${id}`),

    getInterviewPanelsSearch: (params) => apis.get("interview-panels/search", { params }),
            



  /* Optional master all */
  getMasterAll: () => apis.get("/all"),

  getMasterDropdownData: () => apis.get('/master-dd-data/get/committees'),


  // GET all
  getAllGenericDocuments: () =>
    apis.get("/rec-generic-documents/all"),

  // SAVE (UPLOAD)
  saveGenericDocument: (type, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apis.post(
      `/rec-generic-documents/save-generic-document/${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },


  // DELETE
  deleteGenericDocument: (id) =>
    apis.delete(`/rec-generic-documents/delete/${id}`),


  getMasterDisplayAll: () =>
  apis.get("/display/all"),

  getAzureBlobSasUrl(dir, client = "candidate") {
    return apis.get(
      "/azureblob/file/sas-url",
      {
        params: { dir },
        headers: {
          "X-Client": client,
        },
      }
    );
  },
  
    getUser: () => apis.get('/user/all'),

  getAllMasters: () => apis.get("/display/all"),
  getUser: () => apis.get('/user/all'),
   getAllCertificates: () =>
    apis.get("/certificates-master/all"),


};

export default masterApiService;
