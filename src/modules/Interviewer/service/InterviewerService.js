import { api } from "../../../core/service/apiService";

const BASE = "/recruiter/interviewer";

const InterviewerService = {

  getPanelPositions: () =>
    api.get(`${BASE}/get-panel-positions`),

  getCandidatesByPositionAndDate: (positionId, dateStr) =>
    api.get(`${BASE}/get-candidates-by-position`, {
      params: {
        positionId,
        date: dateStr
      }
    }),

  /*  NEW */
  setCandidateScore: (payload) =>
    api.post(`${BASE}/save-candidate-score`, payload)

};

export default InterviewerService;
