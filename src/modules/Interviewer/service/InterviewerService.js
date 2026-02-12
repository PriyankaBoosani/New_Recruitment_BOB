import { api } from "../../../core/service/apiService";

const BASE = "/recruiter/interviewer";

const InterviewerService = {

  /* ===== PANEL POSITIONS ===== */
  getPanelPositions: () =>
    api.get(`${BASE}/positions`),

  /* ===== CANDIDATES BY POSITION + DATE ===== */
  getCandidatesByPositionAndDate: (positionId, dateStr) =>
    api.get(`${BASE}/candidates`, {
      params: {
        positionId,
        date: dateStr
      }
    })

};

export default InterviewerService;
    