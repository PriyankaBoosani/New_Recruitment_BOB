import { nodeApi, api, apis } from "../../../core/service/apiService";

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

  // Bulk import methods for panels
  bulkAddPanels: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apis.post('/interview-panels/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadPanelTemplate: () => apis.get('/interview-panels/download-panel-template', { responseType: 'blob' }),

  // Bulk import methods for position assignments
  bulkImportPositionAssignments: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/recruiter/position-panel/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadPositionAssignmentTemplate: () => api.get('/recruiter/position-panel/download-assignment-template', { responseType: 'blob' }),

  approvePanels: (ids, comments) =>
    api.post("/recruiter/position-panel/approve-committee", {
      positionPanelIds: ids,
      comments: comments
    }),

  rejectPanels: (ids, comments) =>
    api.post("/recruiter/position-panel/reject-committee", {
      positionPanelIds: ids,
      comments: comments
    }),
  getRequisitionApprovalHistory: (panelId) =>
    api.get(
      `/recruiter/workflow-approval/get-panels-approval-history/${panelId}`
    ),

};

export default committeeManagementService;
