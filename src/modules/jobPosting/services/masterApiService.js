// src/core/service/masterApiService.js
import { apis } from "../../../core/service/apiService";

const masterApiService = {
  getAllMasters: () => apis.get("/display/all"),
  getUser: () => apis.get('/user/all'),
  getAllCertificates: () =>
    apis.get("/certificates-master/all"),

  getSasUrl: (dir) =>
    apis.get("/azureblob/file/sas-url", {
      params: { dir },
      headers: {
        "X-Client": "candidate" // or recruiter (don’t guess, use real value)
      }
    }),

};


export default masterApiService;
