import { nodeApi, api,apis } from "../../../core/service/apiService";

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

  downloadPanelTemplate: () => apis.get('/interview-panels/download-panel-template', { responseType: 'blob' })


};

export default committeeManagementService;
