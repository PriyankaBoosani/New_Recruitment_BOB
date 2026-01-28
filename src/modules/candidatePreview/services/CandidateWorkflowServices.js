import { nodeApi, api, candidateApi} from "../../../core/service/apiService";
 
const candidateWorkflowServices = {
  /* Users (Node API) */
  // Note: auth header is injected by nodeApi interceptor; no need to pass token manually
 
  getCandidateAllDetails: (candidateId, applicationId) =>
    candidateApi.get(
      `/candidate/candidate/get-all-details/${candidateId}/${applicationId}`
    ),
 
getRegister: () => nodeApi.get('/getdetails/users/all'),
  //registerUser: (data) => nodeApi.post('/recruiter-auth/recruiter-register', data),
 
  // getJobPositionById: (positionId) =>
  // api.get(
  //   `/recruiter/job-positions/get-job-position-by-id/${positionId}`
  // ),
 


    getJobPositionById: (positionId) =>
  api.get(
    `/recruiter/job-positions/get-job-position-by-id/f6efff22-4b5e-4d53-8f40-226dd502df3f`
  ),


    /* ================= REQUISITIONS ================= */

  // GET ALL REQUISITIONS
 getRequisitions: (name = "") =>
  api.get(
    "/recruiter/job-requisitions/get-requisitions",
    {
      params: { name }   // Swagger-supported
    }
  ),


  /* ================= POSITIONS ================= */

  // GET POSITIONS BY REQUISITION ID
getPositionsByRequisitionId: (requisitionId, name = "") =>
  api.get("/recruiter/job-positions/get-positions", {
    params: { requisitionId, name }
  }),

 
 
};  
 
export default candidateWorkflowServices;