import { candidateApi, nodeApi } from "../../../core/service/apiService";

const candidateWorkflowServices = {
  getCandidateAllDetails: (candidateId, applicationId) =>
    candidateApi.get(
      `/candidate/candidate/get-all-details/${candidateId}/${applicationId}`
    ),
};

export default candidateWorkflowServices;
