// src/core/service/masterApiService.js
import { apis } from "../../../core/service/apiService";

const masterApiService = {
  getAllMasters: () => apis.get("/display/all"),
  getUser: () => apis.get('/user/all'),
   getAllCertificates: () =>
    apis.get("/certificates-master/all"),

};


export default masterApiService;
