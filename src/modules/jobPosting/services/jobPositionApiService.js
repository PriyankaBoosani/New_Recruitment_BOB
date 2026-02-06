import { api } from "../../../core/service/apiService";

const jobPositionApiService = {
  getPositionsByRequisition: (requisitionId) =>
    api.get(
      `/recruiter/job-positions/get-job-position-by-requisition/${requisitionId}`
    ),

  getPositionById: (positionId) =>
    api.get(
      `/recruiter/job-positions/get-job-position-by-id/${positionId}`
    ),

  /** ✅ multipart/form-data */
  createPosition: ({ dto, indentFile }) => {
    const formData = new FormData();

    formData.append(
      "jobPositionsDTO",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    if (indentFile) {
      formData.append("indentFile", indentFile);
    }

    return api.post(
      "/recruiter/job-positions/create-job-position",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },


  updatePosition: ({ dto, indentFile }) => {
    const formData = new FormData();

    // REQUIRED by backend
    formData.append(
      "jobPositionsDTO",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    // optional
    if (indentFile) {
      formData.append("indentFile", indentFile);
    }

    return api.post(
      "/recruiter/job-positions/update-job-position",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Client": "recruiter",
        },
      }
    );
  },


  deletePositionById: (positionId) =>
    api.delete(
      `/recruiter/job-positions/delete-job-position-by-id/${positionId}`
    ),


  getRequisitionById: (id) => api.get(`/recruiter/job-requisitions/${id}`),

  downloadTemplate: () => api.get("/recruiter/job-positions/download-template", { responseType: 'blob' }),


  bulkImport: (requisitionId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(
      `/recruiter/job-positions/create-bulk-positions/${requisitionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Client": "recruiter"
        }
      }
    );
  },
  

  // CANDIDATE SCREENING APIs
  getRequisitions: (name = "") =>
  api.get("/recruiter/job-requisitions/get-requisitions", {
    params: { name },
    headers: { "X-Client": "recruiter" }
  }),

  getPositionsByReqId: ({ requisitionId, searchText = "" }) =>
  api.get("/recruiter/job-positions/get-positions", {
    params: { requisitionId, searchText },
    headers: { "X-Client": "recruiter" },
  }),

  getCandidatesByPosition: (payload) =>
  api.post(
    "/recruiter/candidate-screening/get-candidate-details",
    payload,
    {
      headers: { "X-Client": "recruiter" },
    }
  ),

  getScreeningCommitteeStatus: (applicationId) =>
  api.get(
    `/recruiter/document-verification/get-screening-committee/${applicationId}`,
    {
      headers: {
        "X-Client": "recruiter",
      },
    }
  ),


  getZonalDocumentStatus: (applicationId) =>
  api.get(
    `/recruiter/zonal-verification/documents/${applicationId}`,
    {
      headers: {
        "X-Client": "recruiter",
      },
    }
  ),


  saveScreeningDecision: (payload) =>
    api.post(
      "/recruiter/document-verification/save-screening-committee/verify",
      payload,
      {
        headers: { "X-Client": "recruiter" },
      }
    ),

  saveCandidateDiscrepancyDetails(payload) {
    return api.post(
      "/recruiter/candidate-screening/save-candidate-discrepancy-details",
      payload,
      {
        headers: {
          "X-Client": "recruiter",
        },
      }
    );
  },











submitOverallZonalVerification(payload) {
  return api.post(
    "/recruiter/zonal-verification/submit-overall-verification",
    payload
  );
},



verifyZonalDocument(payload) {
  return api.post(
    "/recruiter/zonal-verification/verify-document",
    payload,
    {
      headers: {
        "X-Client": "recruiter" 
      }
    }
  );
},


updateZonalAbsent(applicationId, isAbsent) {
  return api.post(
    `/recruiter/zonal-verification/update-absent-status`,
    null,
    {
      params: { applicationId, isAbsent },
      headers: {
        "X-Client": "recruiter"
      }
    }
  );
},




  getCandidateDiscrepancyDetails(applicationId) {
    return api.get(
      "/recruiter/candidate-screening/get-candidate-discrepancy-details",
      {
        params: { applicationId },
        headers: {
          "X-Client": "recruiter",
        },
      }
    );
  },
};

export default jobPositionApiService;
