export const mapJobRequisitionFromApi = (item = {}) => {
  const rawStatus = item.requisitionStatus ?? "";

  return {
    id: item.id ?? "",
    requisitionId: item.requisitionCode ?? "",
    code: item.requisitionTitle ?? "",

    // ✅ KEEP RAW VALUE FOR LOGIC
    status: rawStatus,
    statusType: getStatusBadge(rawStatus),

    departments: item.departmentCount ?? 0,
    positions: item.positionCount ?? 0,
    vacancies: item.vacancyCount ?? 0,

    startDate: item.startDate ?? "-",
    endDate: item.endDate ?? "-",
    hasDraftPositions: item.hasDraftPositions === true,

    // ✅ Business logic uses RAW status
    editable: rawStatus === "NEW"
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
    case "L1_PENDING":
      return "secondary";
    default:
      return "secondary";
  }
};