// src/services/masterApiService.js
import { api } from "../../../core/service/apiService"; // reuse axios instances + interceptors

const requisitionApiService = {
  createRequisition: (formData) =>
    api.post(
      "/recruiter/job-requisitions/create",
      formData,
      {
        headers: {
          // 🔥 this removes application/json set globally
          "Content-Type": undefined
        }
      }
    ),
  deleteRequisition: (id) =>
    api.delete(`/recruiter/job-requisitions/${id}`),

  // get single requisition
  getRequisitionById: (id) => api.get(`/recruiter/job-requisitions/${id}`),

  // update requisition (PUT) — same multipart form-data pattern as create
  updateRequisition: (id, formData) =>
    api.put(
      `/recruiter/job-requisitions/${id}`,
      formData,
      {
        headers: {
          "Content-Type": undefined
        }
      }
    ),

  bulkImport: (data) =>
    api.post("/positions/import", data),

  downloadTemplate: () =>
    api.get("/positions/template", { responseType: "blob" }),

  getJobRequisitions: ({ year, status, search, page, size }) =>
    api.get("/recruiter/job-requisitions", {
      params: {
        year,
        status,
        search,
        page,
        size
      }
    }),
};

export default requisitionApiService;
