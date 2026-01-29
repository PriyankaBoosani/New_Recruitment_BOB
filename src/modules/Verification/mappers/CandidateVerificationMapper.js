export const mapRequisitionsToDropdown = (apiData = []) => {
  return apiData.map((item) => ({
    id: item.id,
    code: item.requisitionCode,
    title: item.requisitionTitle,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.requisitionStatus,
  }));
};
