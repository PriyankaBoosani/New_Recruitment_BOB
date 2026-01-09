import { api } from "../../../core/service/apiService";

const jobPositionApiService = {
  getPositionsByRequisition: (requisitionId) =>
    api.get(
      `/recruiter/job-positions/get-job-position-by-requisition/${requisitionId}`
    ),

  getPositionById: (positionId) =>
    api.get(
      `/recruiter/job-positions/get-job-position-by-id/${positionId}`
    ),

  /** ✅ multipart/form-data */
   createPosition: ({ dto, indentFile }) => {
    const formData = new FormData();

    // MUST match Swagger name exactly
    formData.append(
      "jobPositionsDTO",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    if (indentFile) {
      formData.append("indentFile", indentFile);
    }

    return api.post(
      "/recruiter/job-positions/create-job-position",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updatePosition: (positionId, payload) =>
    api.put(
      `/recruiter/job-positions/${positionId}`,
      payload
    ),
};

export default jobPositionApiService;
