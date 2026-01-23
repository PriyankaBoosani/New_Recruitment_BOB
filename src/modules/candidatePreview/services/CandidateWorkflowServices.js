import { nodeApi } from "../../../core/service/apiService";

const candidateWorkflowServices = {
  /* Users (Node API) */
  // Note: auth header is injected by nodeApi interceptor; no need to pass token manually


 getRegister: () => nodeApi.get('/getdetails/users/all'),
  //registerUser: (data) => nodeApi.post('/recruiter-auth/recruiter-register', data),


};

export default candidateWorkflowServices;