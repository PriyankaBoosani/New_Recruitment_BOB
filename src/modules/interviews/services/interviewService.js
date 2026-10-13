import { api } from "../../../core/service/apiService";

const interviewService = {
  getPanelsByPosition(payload) {
    return api.post(
      `recruiter/interview-scheduling/get-assigned-panels`,
      payload
    );
  },
  allocatePanels(payload) {
    return api.post(
      `recruiter/interview-scheduling/allocate-interview`,
      payload,
      {
        timeout: 3000000,
      }
    );
  },
  scheduleInterview(payload) {
    return api.post(
      `recruiter/interview-scheduling/schedule-interview`,
      payload
    );
  },
  getScheduledSlots(payload) {
    return api.post(`recruiter/interview-scheduling/scheduled-slots`, payload);
  },
   getInterviewCandidateJobDetails(payload) {
    return api.post(
      `recruiter/interview-scheduling/job/details`,
      payload
    );
  },
 
};

export default interviewService;
