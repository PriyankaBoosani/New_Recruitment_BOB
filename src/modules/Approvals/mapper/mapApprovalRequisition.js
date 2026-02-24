const getStatusBadge = (status = "") => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "L1_PENDING":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "secondary";
  }
};

export const mapApprovalRequisition = (item = {}) => ({
  id: item.id ?? "",
  requisitionId: item.requisitionCode ?? "",
  code: item.requisitionTitle ?? "",
  status: item.requisitionStatus ?? "",
  statusType: getStatusBadge(item.requisitionStatus),
  departments: item.departmentCount ?? 0,
  positions: item.positionCount ?? 0,
  vacancies: item.vacancyCount ?? 0,
  startDate: item.startDate ?? "",
  endDate: item.endDate ?? "",
  hasDraftPositions: item.hasDraftPositions === true,
  editable: false // approvals should NOT be editable
});