import { nodeApi, api, apis } from "../../../core/service/apiService";

const interviewService = {
  getPanelsByPosition(positionId) {
    return api.get(
      `recruiter/interview-scheduling/get-assigned-panels?positionId=${positionId}`
    );
  },
  allocatePanels(payload) {
    return api.post(
      `recruiter/interview-scheduling/allocate-interview`,
      payload
    );
  },
  scheduleInterview(payload) {
    return api.post(
      `recruiter/interview-scheduling/schedule-interview`,
      payload
    );
  }
};

export default interviewService;
