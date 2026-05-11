import { nodeApi, api, apis } from "../../../core/service/apiService";

const interviewService = {
  getPanelsByPosition(payload) {
    return api.post(
      `recruiter/interview-scheduling/get-assigned-panels`,payload
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
