import { nodeApi, api } from "../../../core/service/apiService";

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
    ),
  assignPanelToPosition: (jobPositionId, payload) =>
    api.post(
      `/recruiter/position-panel/save-or-update/${jobPositionId}`,
      payload
    ),

  getPanelsByPosition(positionId) {
    return api.get(
      `recruiter/position-panel/get-by-position-id/${positionId}`
    );
  },
  approvePanels: (panelIds) =>
    api.post(
      "/recruiter/position-panel/approve-committee",
      panelIds
    ),
  rejectPanels: (panelIds) =>
    api.post(
      "/recruiter/position-panel/reject-committee",
      panelIds
    ),
  getRequisitionApprovalHistory: (panelId) =>
    api.get(
      `/recruiter/workflow-approval/get-panels-approval-history/${panelId}`
    ),

};

export default committeeManagementService;
