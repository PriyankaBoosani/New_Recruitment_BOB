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
  
  
    bulkImport: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/recruiter/job-positions/create-bulk-positions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
};

export default jobPositionApiService;
