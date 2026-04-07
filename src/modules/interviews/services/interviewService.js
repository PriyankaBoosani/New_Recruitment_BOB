import { nodeApi, api, apis } from "../../../core/service/apiService";

const interviewService = {
  getPanelsByPosition(positionId) {
    return api.get(
      `recruiter/position-panel/get-by-position-id/${positionId}`
    );
  },
  allocatePanels(payload) {
    return api.post(
      `recruiter/interview-scheduling/allocate-interview`,
      payload
    );
  }
};

export default interviewService;
