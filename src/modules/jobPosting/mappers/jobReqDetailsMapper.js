const normalizeStatus = (status = "") => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase());
};

export const mapJobRequisitionFromApi = (item = {}) => {
  const normalizedStatus = normalizeStatus(item.requisitionStatus);

  return {
    id: item.id ?? "",
    requisitionId: item.requisitionCode ?? "",
    code: item.requisitionTitle ?? "",

    status: normalizedStatus,
    statusType: getStatusBadge(item.requisitionStatus),

    departments: item.departmentCount ?? 0,
    positions: item.positionCount ?? 0,
    vacancies: item.vacancyCount ?? 0,

    startDate: item.startDate ?? "-",
    endDate: item.endDate ?? "-",
    hasDraftPositions: item.hasDraftPositions === true,
    editable: normalizedStatus === "New"
  };
};

const getStatusBadge = (status = "") => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "NEW":
      return "warning";
    default:
      return "secondary";
  }
};
