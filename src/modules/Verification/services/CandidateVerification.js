import apiClient from "../../../shared/services/apiClient";

const CandidateVerificationService = {
  getRequisitions: () =>
    apiClient.get(
      "/recruiter/job-requisitions/get-requisitions"
    ),
};

export default CandidateVerificationService;
