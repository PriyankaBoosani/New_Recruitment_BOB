// src/services/masterApiService.js
import { api } from "../../../core/service/apiService"; // reuse axios instances + interceptors

const requisitionApiService = {
      createRequisition: (payload) => api.post('/recruiter/job-requisitions/create', payload),
      bulkImport: (data) =>
            api.post("/positions/import", data),

      downloadTemplate: () =>
            api.get("/positions/template", { responseType: "blob" }),
}

export default requisitionApiService;
