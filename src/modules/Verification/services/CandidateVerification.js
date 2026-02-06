import { api } from "../../../core/service/apiService";

const CandidateVerificationService = {

  /* ================= GET BY DATE ================= */
  getCandidatesByDate: (dateStr) =>
    api.get(
      "/recruiter/zonal-verification/candidates",
      {
        params: { date: dateStr }
      }
    ),

  /* ================= UPDATE ABSENT ================= */
updateAbsentStatus: (applicationId, isAbsent) =>
  api.post(
    "/recruiter/zonal-verification/update-absent-status",
    null,
    {
      params: {
        applicationId,
        isAbsent
      }
    }
  ),

};

export default CandidateVerificationService;
