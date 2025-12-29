export const mapRequisitionFromApi = (apiReq) => ({
    id: apiReq.id,
    title: apiReq.title,
    description: apiReq.description,
    startDate: apiReq.startDate,
    endDate: apiReq.endDate,
})

export const mapRequisitionsFromApi = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapRequisitionFromApi);
};

// src/modules/jobPostings/mappers/requisitionMapper.js
export const mapRequisitionToApi = (uiData, indentFile) => {
  const formData = new FormData();

  formData.append("requisitionTitle", uiData.title);
  formData.append("requisitionDescription", uiData.description);
  formData.append("startDate", uiData.startDate);
  formData.append("endDate", uiData.endDate);

  if (indentFile) {
    formData.append("indentDocument", indentFile);
  }

  return formData;
};
