// src/modules/jobPostings/mappers/requisitionMapper.js

export const mapRequisitionToApi = (uiData, indentFile) => {
  const formData = new FormData();

  const requisition = {
    requisitionTitle: uiData.title,
    requisitionDescription: uiData.description,
    startDate: uiData.startDate,
    endDate: uiData.endDate,

    requisitionStatus: "New",
    isActive: true,

    positionCount: 0,
    departmentCount: 0,
    vacancyCount: 0,

    requisitionComments: null,
   // indentPath: null,
    requisitionCode: null,
    id: null
  };

  // 🔥 MUST be Blob
  formData.append(
    "requisition",
    new Blob([JSON.stringify(requisition)], {
      type: "application/json"
    })
  );

  // 🔥 MUST be exact field name
  // if (indentFile) {
  //   formData.append("indentFile", indentFile);
  // }

  return formData;
};
