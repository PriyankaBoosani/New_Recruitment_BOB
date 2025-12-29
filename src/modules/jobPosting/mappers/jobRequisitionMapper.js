export const mapJobRequisitionFromApi = (item = {}) => ({
  id: item.id ?? "",
  requisitionId: item.requisitionCode ?? "",
  code: item.requisitionTitle ?? "",

  status: item.requisitionStatus ?? "Unknown",
  statusType: getStatusBadge(item.requisitionStatus),

  departments: item.departmentCount ?? 0,
  positions: item.positionCount ?? 0,
  vacancies: item.vacancyCount ?? 0,

  startDate: item.startDate ?? "-",
  endDate: item.endDate ?? "-",

  editable: item.requisitionStatus === "New"
});

const getStatusBadge = (status = "") => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    case "New":
      return "warning";
    default:
      return "secondary";
  }
};
