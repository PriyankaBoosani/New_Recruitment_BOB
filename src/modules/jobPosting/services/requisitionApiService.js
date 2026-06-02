// src/services/masterApiService.js
import { api } from "../../../core/service/apiService"; // reuse axios instances + interceptors

const requisitionApiService = {
  createRequisition: (formData) =>
    api.post("/recruiter/job-requisitions/create", formData, {
      headers: {
        // 🔥 this removes application/json set globally
        "Content-Type": undefined,
      },
    }),
  deleteRequisition: (id) => api.delete(`/recruiter/job-requisitions/${id}`),

  // get single requisition
  getRequisitionById: (id) => api.get(`/recruiter/job-requisitions/${id}`),

  // update requisition (PUT) — same multipart form-data pattern as create
  updateRequisition: (id, formData) =>
    api.put(`/recruiter/job-requisitions/${id}`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    }),

  getJobRequisitions: ({ year, month, status, search, page, size, departmentId }) =>
    api.get("/recruiter/job-requisitions", {
      params: {
        year,
        month,
        status,
        search,
        page,
        size,
        ...(departmentId && { departmentId }),
      },
    }),
  submitForApproval: (payload) =>
    api.post("/recruiter/job-requisitions/submit-for-approval", payload),
  submitForApprovalFlow: (payload) =>
    api.post("/recruiter/job-requisitions/submit-for-approval-new", payload),
  getAvailableYears: () => api.get("/recruiter/job-requisitions/get-years"),
};

export default requisitionApiService;
