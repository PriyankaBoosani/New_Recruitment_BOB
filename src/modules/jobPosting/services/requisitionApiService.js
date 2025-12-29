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

updateRequisition: (id, payload) =>
  api.put(`/recruiter/job-requisitions/update/${id}`, payload),

    getJobRequisitionById: (id) =>
  api.get(`/recruiter/job-requisitions/${id}`),


bulkImport: (data) =>
            api.post("/positions/import", data),

      downloadTemplate: () =>
            api.get("/positions/template", { responseType: "blob" }),
      // src/services/masterApiService.js

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

}



export default requisitionApiService;
