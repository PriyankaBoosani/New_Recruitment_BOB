import { nodeApi,api } from "../../../core/service/apiService";

const committeeManagementService = {
  getAllusers: () =>
    nodeApi.get(
      `/getdetails/users/all`
    ),

    
  // GET ALL REQUISITIONS
 getRequisitions: (name = "") =>
  api.get(
    "/recruiter/job-requisitions/get-requisitions",
   
  ),

    getPositionsByRequisition: (requisitionId) => 
       api.get(
        "/recruiter/job-positions/get-positions",
        {
          params: { requisitionId }, // ✅ query param
         
        }
      )
    

};

export default committeeManagementService;
